interface DashboardHeaderProps {
  profile: {
    firstName: string | null
    lastName: string | null
    email: string
  } | null
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{profile?.firstName ? `, ${profile.firstName}` : ''}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Your connectivity dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="font-medium text-gray-900">{profile?.email}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-lg">
                {profile?.firstName?.[0] || profile?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 