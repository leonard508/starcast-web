# Starcast ISP Platform

A modern ISP reseller platform built with Next.js for managing internet service packages and customer applications.

## Features

- Package comparison and selection
- Customer application management
- Admin dashboard for business operations
- Responsive design for all devices

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: BetterAuth
- **Deployment**: Railway

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables
4. Run the development server: `npm run dev`

## Environment Setup

Copy `.env.example` to `.env` and configure your environment variables:

```env
# Database
DATABASE_URL="your-database-url"

# Authentication
BETTER_AUTH_SECRET="your-auth-secret"
NEXT_PUBLIC_BETTER_AUTH_URL="your-app-url"

# Email Service
BREVO_API_KEY="your-email-api-key"
EMAIL_PROVIDER="brevo"
FROM_EMAIL="your-email@domain.com"
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run type-check` - TypeScript validation
- `npm run lint:check` - ESLint validation

## License

Private - All rights reserved

## Support

For technical support, contact the development team.