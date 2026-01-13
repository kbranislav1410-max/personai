'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AnalysisRun {
  id: number;
  Position: {
    title: string;
  };
  createdAt: string;
  status: string;
  CandidateScore: Array<{ id: number }>;
}

export default function AnalysisRunsPage() {
  const [analysisRuns, setAnalysisRuns] = useState<AnalysisRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalysisRuns();
  }, []);

  const fetchAnalysisRuns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analysis-runs');
      const result = await response.json();

      if (result.ok) {
        setAnalysisRuns(result.data);
      } else {
        setError(result.error || 'Failed to load analysis runs');
      }
    } catch (err) {
      setError('Failed to load analysis runs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      done: 'bg-green-100 text-green-800',
      running: 'bg-blue-100 text-blue-800',
      queued: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analysis runs...</div>
      </div>
    );
  }

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

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {analysisRuns.length === 0 && !error ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-600">
            No analysis runs yet. Start your first analysis!
          </p>
          <Link
            href="/analysis"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            <span>+</span>
            New Analysis
          </Link>
        </div>
      ) : (
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
                      {run.Position.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {formatDate(run.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusBadge(
                        run.status
                      )}`}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {run.CandidateScore?.length || 0}
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
      )}
    </div>
  );
}
