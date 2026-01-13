import Link from 'next/link';

export default function AnalysisRunsPage() {
  // Placeholder data
  const analysisRuns = [
    {
      id: 1,
      position: 'Senior Software Engineer',
      createdAt: '2026-01-13 14:30',
      status: 'Completed',
      candidatesAnalyzed: 12,
      topScore: 95,
    },
    {
      id: 2,
      position: 'Product Manager',
      createdAt: '2026-01-12 10:15',
      status: 'Completed',
      candidatesAnalyzed: 8,
      topScore: 88,
    },
    {
      id: 3,
      position: 'UX Designer',
      createdAt: '2026-01-11 16:45',
      status: 'Failed',
      candidatesAnalyzed: 0,
      topScore: null,
    },
    {
      id: 4,
      position: 'Senior Software Engineer',
      createdAt: '2026-01-10 09:00',
      status: 'Completed',
      candidatesAnalyzed: 15,
      topScore: 92,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
          <p className="mt-1 text-sm text-gray-600">
            View past AI analysis runs and results
          </p>
        </div>
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <span>+</span>
          New Analysis
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Candidates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Top Score
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analysisRuns.map((run) => (
              <tr key={run.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {run.position}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{run.createdAt}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      run.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : run.status === 'Running'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {run.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {run.candidatesAnalyzed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {run.topScore !== null ? (
                    <div className="text-sm font-semibold text-gray-900">
                      {run.topScore}%
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">-</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/analysis-runs/${run.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Results
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
