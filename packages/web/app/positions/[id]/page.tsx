'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Position = {
  id: number;
  title: string;
  department: string;
  seniority: string;
  description?: string;
  mustHave: string;
  niceToHave: string;
  createdAt: string;
};

export default function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positionId, setPositionId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      setPositionId(p.id);
      fetchPosition(p.id);
    });
  }, [params]);

  const fetchPosition = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/positions/${id}`);
      const data = await response.json();

      if (data.ok) {
        setPosition(data.data);
      } else {
        setError(data.error || 'Failed to fetch position');
      }
    } catch (err) {
      setError('An error occurred while fetching the position');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading position...</div>
      </div>
    );
  }

  if (error || !position) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error || 'Position not found'}</p>
        </div>
        <Link
          href="/positions"
          className="text-sm text-blue-600 hover:text-blue-900"
        >
          ← Back to Positions
        </Link>
      </div>
    );
  }

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
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(position.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>

              {position.description && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {position.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Must-Have</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{position.mustHave}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Nice-To-Have</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{position.niceToHave}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href={`/analysis?positionId=${positionId}`}
                className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Start AI Analysis
              </Link>
              <Link
                href={`/positions/${positionId}/edit`}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Position
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>
            <p className="text-sm text-gray-600">
              Use the &quot;Start AI Analysis&quot; button to begin analyzing candidates for this position.
              The AI will evaluate all candidates and provide match scores based on the position requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
