import Link from 'next/link'

export default function APIHome() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Starcast Backend API
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Package management and promotion system backend
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <APICard
            title="Packages"
            description="Manage internet service packages (Fibre, LTE Fixed, LTE Mobile)"
            endpoints={[
              { method: 'GET', path: '/api/packages', desc: 'List all packages' },
              { method: 'POST', path: '/api/packages', desc: 'Create new package' }
            ]}
          />
          
          <APICard
            title="Promotions"
            description="Create and manage promotional offers and discount codes"
            endpoints={[
              { method: 'GET', path: '/api/promotions', desc: 'List promotions' },
              { method: 'POST', path: '/api/promotions', desc: 'Create promotion' },
              { method: 'POST', path: '/api/promotions/validate', desc: 'Validate promo code' }
            ]}
          />
          
          <APICard
            title="Providers"
            description="Manage ISP providers and their information"
            endpoints={[
              { method: 'GET', path: '/api/providers', desc: 'List all providers' },
              { method: 'POST', path: '/api/providers', desc: 'Create provider' }
            ]}
          />
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Test</h2>
          <p className="text-gray-600 mb-4">
            Test the API endpoints directly:
          </p>
          <div className="space-y-2">
            <TestLink href="/api/packages" label="GET /api/packages - List all packages" />
            <TestLink href="/api/providers" label="GET /api/providers - List all providers" />
            <TestLink href="/api/promotions?current=true" label="GET /api/promotions?current=true - Active promotions" />
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Database Status</h3>
          <p className="text-blue-700">
            ✅ SQLite database initialized<br/>
            ✅ Schema applied with Prisma<br/>
            ✅ Sample data seeded (MTN, Vodacom, Telkom packages with promotions)
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline">
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  )
}

function APICard({ title, description, endpoints }: {
  title: string
  description: string
  endpoints: Array<{ method: string; path: string; desc: string }>
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="space-y-2">
        {endpoints.map((endpoint, idx) => (
          <div key={idx} className="text-sm">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {endpoint.method}
            </span>
            <code className="ml-2 text-gray-700">{endpoint.path}</code>
            <div className="text-gray-500 text-xs mt-1 ml-12">{endpoint.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TestLink({ href, label }: { href: string; label: string }) {
  return (
    <div>
      <Link href={href} target="_blank" className="text-blue-600 hover:text-blue-800 hover:underline">
        {label} →
      </Link>
    </div>
  )
}