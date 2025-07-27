import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql", // Using PostgreSQL to match Railway deployment
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for now during development
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [
    "http://localhost:3000", 
    "http://localhost:3001", 
    "http://localhost:3002",
    "https://starcast-web-production.up.railway.app"
  ],
})