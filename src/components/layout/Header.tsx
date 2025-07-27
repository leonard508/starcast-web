import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            Starcast Technologies
          </Link>
          <div className="flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/fibre" className="text-gray-700 hover:text-blue-600 transition-colors">
              Fibre
            </Link>
            <Link href="/lte" className="text-gray-700 hover:text-blue-600 transition-colors">
              LTE
            </Link>
            <Link href="/api" className="text-gray-700 hover:text-blue-600 transition-colors">
              API
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header