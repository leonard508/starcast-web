import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import ClientProviders from './ClientProviders'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Starcast Technologies',
  description: 'Lightning-fast fibre and LTE internet solutions nationwide',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#4a90e2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} h-full overflow-x-hidden`}>
        <ClientProviders>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}