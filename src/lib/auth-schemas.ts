import { z } from "zod"

// Simple login schema for existing customers
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
})

// Support ticket schema for customer portal
export const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Please describe your issue"),
  priority: z.enum(["low", "medium", "high"]).default("medium")
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SupportTicketData = z.infer<typeof supportTicketSchema>