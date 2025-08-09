interface PackageCardProps {
  order: {
    id: string
    status: string
    originalPrice: number
    discountAmount: number
    finalPrice: number
    installationDate: string | null
    createdAt: string
    package: {
      name: string
      type: string
      speed: string | null
      data: string | null
      currentPrice: number
      provider: {
        name: string
        slug: string
        logo: string | null
      }
    }
    promotion: {
      code: string
      name: string
      discountType: string
      discountValue: number
    } | null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'PROCESSING':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'APPROVED':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'INSTALLED':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'REJECTED':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'CANCELLED':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'FIBRE':
      return 'Fibre'
    case 'LTE_FIXED':
      return 'LTE Fixed'
    case 'LTE_MOBILE':
      return 'LTE Mobile'
    default:
      return type
  }
}

export function PackageCard({ order }: PackageCardProps) {
  const { package: pkg, status, finalPrice, installationDate, promotion } = order
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      {/* Header with Provider and Status */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          {pkg.provider.logo ? (
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={pkg.provider.logo} 
                alt={pkg.provider.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {pkg.provider.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-bold text-xl text-gray-900">{pkg.name}</h3>
            <p className="text-gray-600">{pkg.provider.name}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {/* Package Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Type</p>
          <p className="font-semibold text-gray-900 mt-1">{getTypeLabel(pkg.type)}</p>
        </div>
        
        {pkg.speed && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Speed</p>
            <p className="font-semibold text-gray-900 mt-1">{pkg.speed}</p>
          </div>
        )}
        
        {pkg.data && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Data</p>
            <p className="font-semibold text-gray-900 mt-1">{pkg.data}</p>
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Monthly Cost</p>
          <p className="font-bold text-gray-900 mt-1 text-lg">R{finalPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Promotion Information */}
      {promotion && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Promotion Applied: {promotion.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Code: {promotion.code} | 
                {promotion.discountType === 'PERCENTAGE' 
                  ? ` ${promotion.discountValue}% discount`
                  : ` R${promotion.discountValue} discount`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Installation Information */}
      {installationDate && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Installation Date</p>
              <p className="text-xs text-gray-600 mt-1">
                {new Date(installationDate).toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-4 border-t border-gray-100">
        {status === 'INSTALLED' ? (
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold shadow-sm">
              View Bills
            </button>
            <button className="bg-gray-700 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold shadow-sm">
              Pay Now
            </button>
            <button className="bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold shadow-sm">
              Support
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold shadow-sm">
              Track Status
            </button>
            <button className="bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold shadow-sm">
              Support
            </button>
          </div>
        )}
      </div>
    </div>
  )
}