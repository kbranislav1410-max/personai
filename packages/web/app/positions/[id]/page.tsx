import Link from 'next/link';

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Placeholder data
  const position = {
    id,
    title: 'Senior Software Engineer',
    department: 'Engineering',
    seniority: 'Senior',
    status: 'Active',
    description: 'We are looking for an experienced software engineer...',
    mustHave: '5+ years of experience with TypeScript, React, Node.js',
    niceToHave: 'Experience with Next.js, Prisma, and cloud platforms',
    createdAt: '2026-01-10',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{position.title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Position ID: {position.id}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/positions/${id}/edit`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <Link
            href="/positions"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Positions
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h2>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900">{position.department}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Seniority Level</dt>
                <dd className="mt-1 text-sm text-gray-900">{position.seniority}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    {position.status}
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{position.createdAt}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{position.description}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Must-Have</h3>
                <p className="text-sm text-gray-600">{position.mustHave}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Nice-To-Have</h3>
                <p className="text-sm text-gray-600">{position.niceToHave}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/analysis?positionId=${id}`}
                className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Run AI Analysis
              </Link>
              <button className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                View Candidates
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Total Candidates</dt>
                <dd className="text-sm font-semibold text-gray-900">12</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Analysis Runs</dt>
                <dd className="text-sm font-semibold text-gray-900">3</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shortlisted</dt>
                <dd className="text-sm font-semibold text-gray-900">5</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
