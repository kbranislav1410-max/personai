export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to PersonAI HR CV Analyzer
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Positions</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">12</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <span className="text-2xl">💼</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Candidates</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">48</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Analysis Runs</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">156</p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">87%</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="rounded-full bg-blue-100 p-2">
              <span>💼</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New position created
              </p>
              <p className="text-sm text-gray-600">Senior Software Engineer - Engineering</p>
              <p className="mt-1 text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="rounded-full bg-green-100 p-2">
              <span>👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New candidate added
              </p>
              <p className="text-sm text-gray-600">John Doe - Resume uploaded</p>
              <p className="mt-1 text-xs text-gray-500">3 hours ago</p>
            </div>
          </div>

          <div className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="rounded-full bg-purple-100 p-2">
              <span>🤖</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Analysis completed
              </p>
              <p className="text-sm text-gray-600">5 candidates analyzed for Senior Developer role</p>
              <p className="mt-1 text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
