import { z } from 'zod'

// Common validation patterns
export const emailSchema = z.string().email('Invalid email address').max(255)
export const phoneSchema = z.string().regex(/^(\+27|0)[0-9]{9}$/, 'Invalid South African phone number').optional()
export const idSchema = z.string().cuid('Invalid ID format')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters').max(100)

// User validation schemas
export const createUserSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1, 'First name is required').max(50).trim(),
  lastName: z.string().min(1, 'Last name is required').max(50).trim(),
  phone: phoneSchema,
  password: passwordSchema,
  role: z.enum(['USER', 'ADMIN', 'SUPPORT']).optional().default('USER')
})

export const updateUserSchema = createUserSchema.partial().extend({
  id: idSchema
})

// Application validation schemas
export const createApplicationSchema = z.object({
  userId: idSchema,
  packageId: idSchema,
  serviceAddress: z.object({
    street: z.string().min(1, 'Street address is required').max(200),
    city: z.string().min(1, 'City is required').max(100),
    province: z.string().min(1, 'Province is required').max(100),
    postalCode: z.string().min(4, 'Postal code is required').max(10),
    complexName: z.string().max(100).optional(),
    unitNumber: z.string().max(20).optional()
  }),
  contactNumber: z.string().min(1, 'Contact number is required').max(20),
  specialRequirements: z.string().max(500).optional(),
  preferredInstallDate: z.string().datetime().optional()
})

export const approveApplicationSchema = z.object({
  reviewedBy: idSchema,
  approvalReason: z.string().max(500).optional(),
  estimatedInstallDate: z.string().datetime().optional()
})

export const rejectApplicationSchema = z.object({
  reviewedBy: idSchema,
  rejectionReason: z.string().min(1, 'Rejection reason is required').max(500),
  adminComments: z.string().max(500).optional()
})

// Package validation schemas
export const createPackageSchema = z.object({
  name: z.string().min(1, 'Package name is required').max(100),
  providerId: idSchema,
  type: z.enum(['FIBRE', 'LTE_FIXED', 'LTE_MOBILE', '5G_FIXED']),
  speed: z.string().max(50).optional(),
  data: z.string().max(50).optional(),
  fupLimit: z.string().max(50).optional(),
  throttleSpeed: z.string().max(50).optional(),
  fupDescription: z.string().max(200).optional(),
  basePrice: z.number().positive('Price must be positive'),
  currentPrice: z.number().positive('Price must be positive'),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false)
})

export const updatePackageSchema = createPackageSchema.partial().extend({
  id: idSchema
})

// Provider validation schemas
export const createProviderSchema = z.object({
  name: z.string().min(1, 'Provider name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  logo: z.string().url('Invalid logo URL').optional(),
  active: z.boolean().optional().default(true)
})

export const updateProviderSchema = createProviderSchema.partial().extend({
  id: idSchema
})

// Promotion validation schemas
export const createPromotionSchema = z.object({
  code: z.string().min(3, 'Promo code must be at least 3 characters').max(20).toUpperCase(),
  name: z.string().min(1, 'Promotion name is required').max(100),
  description: z.string().max(300).optional(),
  packageId: idSchema.optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'OVERRIDE_PRICE']),
  discountValue: z.number().positive('Discount value must be positive'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  usageLimit: z.number().int().positive().optional().default(1),
  active: z.boolean().optional().default(true)
})

export const validatePromotionSchema = z.object({
  code: z.string().min(3).max(20),
  packageId: idSchema.optional()
})

// Email validation schemas
export const sendEmailSchema = z.object({
  to: emailSchema,
  template: z.enum(['WELCOME', 'APPROVAL', 'REJECTION', 'ADMIN_NOTIFICATION']),
  data: z.record(z.any()) // Template-specific data
})

// Import validation schemas
export const importExcelSchema = z.object({
  data: z.string().min(1, 'File data is required'), // Base64 encoded file
  filename: z.string().max(255).optional(),
  sheetName: z.string().max(100).optional()
})

// Bill validation schemas
export const createBillSchema = z.object({
  userId: idSchema,
  packageId: idSchema.optional(),
  amount: z.number().positive('Amount must be positive'),
  vatAmount: z.number().min(0, 'VAT amount cannot be negative'),
  totalAmount: z.number().positive('Total amount must be positive'),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  dueDate: z.string().datetime(),
  billType: z.enum(['MONTHLY', 'PRORATA', 'SETUP', 'CANCELLATION', 'ADJUSTMENT']).optional().default('MONTHLY'),
  description: z.string().max(200).optional()
})

// Payment validation schemas
export const processPaymentSchema = z.object({
  billId: idSchema,
  amount: z.number().positive('Payment amount must be positive'),
  method: z.enum(['OZOW', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_ORDER', 'CASH', 'OTHER']),
  reference: z.string().min(1, 'Payment reference is required').max(100),
  ozowTransactionId: z.string().max(100).optional()
})

// Search and filter schemas
export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

export const applicationFilterSchema = paginationSchema.extend({
  status: z.enum(['PENDING_APPROVAL', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'REQUIRES_INFO', 'CANCELLED']).optional(),
  packageType: z.enum(['FIBRE', 'LTE_FIXED', 'LTE_MOBILE', '5G_FIXED']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional()
})

export const packageFilterSchema = paginationSchema.extend({
  type: z.enum(['FIBRE', 'LTE_FIXED', 'LTE_MOBILE', '5G_FIXED']).optional(),
  providerId: idSchema.optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional()
})

// Utility function to sanitize strings
export function sanitizeString(str: string): string {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .trim()
}

// Utility function to validate and sanitize object
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj }
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      (sanitized as any)[key] = sanitizeString(sanitized[key] as string)
    }
  }
  
  return sanitized
}

// Export type definitions for TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
export type ApproveApplicationInput = z.infer<typeof approveApplicationSchema>
export type RejectApplicationInput = z.infer<typeof rejectApplicationSchema>
export type CreatePackageInput = z.infer<typeof createPackageSchema>
export type CreateProviderInput = z.infer<typeof createProviderSchema>
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
export type ApplicationFilterInput = z.infer<typeof applicationFilterSchema>
export type PackageFilterInput = z.infer<typeof packageFilterSchema>