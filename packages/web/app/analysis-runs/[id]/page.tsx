'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface CandidateScore {
  id: number;
  score: number;
  recommendation: string;
  summary: string;
  strengths: string;
  gaps: string;
  status: string;
  decision: string;
  Candidate: {
    id: number;
    fullName: string;
  };
}

interface AnalysisRun {
  id: number;
  status: string;
  createdAt: string;
  customRequirements: string;
  Position: {
    id: number;
    title: string;
    department: string;
    seniority: string;
  };
  CandidateScore: CandidateScore[];
}

type SortField = 'score' | 'name' | 'recommendation';
type SortDirection = 'asc' | 'desc';

export default function AnalysisRunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [analysisRun, setAnalysisRun] = useState<AnalysisRun | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'yes' | 'maybe' | 'no'>('all');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [updatingDecision, setUpdatingDecision] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnalysisRun();
    }
  }, [id]);

  const fetchAnalysisRun = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analysis-runs/${id}`);
      const result = await response.json();

      if (result.ok) {
        setAnalysisRun(result.data);
      } else {
        setError(result.error || 'Failed to load analysis run');
      }
    } catch (err) {
      setError('Failed to load analysis run');
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (scoreId: number, status: string) => {
    try {
      setUpdatingStatus(scoreId);
      const response = await fetch(`/api/candidate-scores/${scoreId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.ok) {
        // Update local state
        setAnalysisRun(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            CandidateScore: prev.CandidateScore.map(score =>
              score.id === scoreId ? { ...score, status } : score
            ),
          };
        });
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const updateCandidateDecision = async (scoreId: number, decision: string) => {
    try {
      setUpdatingDecision(scoreId);
      const response = await fetch(`/api/candidate-scores/${scoreId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });

      const result = await response.json();

      if (result.ok) {
        // Update local state
        setAnalysisRun(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            CandidateScore: prev.CandidateScore.map(score =>
              score.id === scoreId ? { ...score, decision } : score
            ),
          };
        });
      } else {
        alert(result.error || 'Failed to update decision');
      }
    } catch (err) {
      alert('Failed to update decision');
    } finally {
      setUpdatingDecision(null);
    }
  };

  const exportToCSV = () => {
    if (!analysisRun) return;

    // Prepare CSV data
    const headers = ['Candidate Name', 'Score', 'Recommendation', 'Decision', 'Status', 'Summary'];
    const rows = analysisRun.CandidateScore.map(score => [
      score.Candidate.fullName,
      score.score.toString(),
      score.recommendation,
      score.decision,
      score.status,
      score.summary.replace(/"/g, '""'), // Escape quotes
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analysis_${analysisRun.Position.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredAndSortedScores = () => {
    if (!analysisRun) return [];

    let filtered = analysisRun.CandidateScore;

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(score => score.recommendation === filter);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortField === 'score') {
        comparison = a.score - b.score;
      } else if (sortField === 'name') {
        comparison = a.Candidate.fullName.localeCompare(b.Candidate.fullName);
      } else if (sortField === 'recommendation') {
        const order = { yes: 3, maybe: 2, no: 1 };
        comparison =
          (order[a.recommendation as keyof typeof order] || 0) -
          (order[b.recommendation as keyof typeof order] || 0);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    const styles = {
      yes: 'bg-green-100 text-green-800',
      maybe: 'bg-yellow-100 text-yellow-800',
      no: 'bg-red-100 text-red-800',
    };
    const labels = {
      yes: 'Strong Match',
      maybe: 'Potential Match',
      no: 'Weak Match',
    };
    return {
      className: styles[recommendation as keyof typeof styles] || 'bg-gray-100 text-gray-800',
      label: labels[recommendation as keyof typeof labels] || recommendation,
    };
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-800',
      next_round: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Pending',
      next_round: 'Next Round',
      rejected: 'Rejected',
    };
    return {
      className: styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800',
      label: labels[status as keyof typeof labels] || status,
    };
  };

  const getDecisionButtonClass = (current: string, target: string) => {
    if (current === target) {
      if (target === 'shortlist') return 'bg-green-600 text-white';
      if (target === 'reject') return 'bg-red-600 text-white';
      return 'bg-gray-600 text-white';
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading analysis results...</div>
      </div>
    );
  }

  if (error || !analysisRun) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error || 'Analysis run not found'}</p>
        </div>
        <Link
          href="/analysis-runs"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900"
        >
          ← Back to Analysis History
        </Link>
      </div>
    );
  }

  const filteredScores = getFilteredAndSortedScores();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/analysis-runs"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-900 mb-2"
          >
            ← Back to Analysis History
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Analysis Results: {analysisRun.Position.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {new Date(analysisRun.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Export CSV
        </button>
      </div>

      {/* Position Info */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Title</dt>
            <dd className="mt-1 text-sm text-gray-900">{analysisRun.Position.title}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Department</dt>
            <dd className="mt-1 text-sm text-gray-900">{analysisRun.Position.department}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Seniority</dt>
            <dd className="mt-1 text-sm text-gray-900">{analysisRun.Position.seniority}</dd>
          </div>
        </dl>
      </div>

      {/* Filters and Summary */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2">
            {(['all', 'yes', 'maybe', 'no'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f === 'yes' ? 'Strong' : f === 'maybe' ? 'Potential' : 'Weak'}
                {' '}({
                  f === 'all'
                    ? analysisRun.CandidateScore.length
                    : analysisRun.CandidateScore.filter(s => s.recommendation === f).length
                })
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                Candidate {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('score')}
              >
                Score {sortField === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('recommendation')}
              >
                Recommendation {sortField === 'recommendation' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Summary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Decision
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredScores.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                  No candidates match the selected filter.
                </td>
              </tr>
            ) : (
              filteredScores.map(score => {
                const recommendationBadge = getRecommendationBadge(score.recommendation);
                const statusBadge = getStatusBadge(score.status);
                return (
                  <tr key={score.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/candidates/${score.Candidate.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        {score.Candidate.fullName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{score.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${recommendationBadge.className}`}>
                        {recommendationBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md">{score.summary}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateCandidateDecision(score.id, 'undecided')}
                          disabled={updatingDecision === score.id}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${getDecisionButtonClass(score.decision, 'undecided')}`}
                          title="Undecided"
                        >
                          —
                        </button>
                        <button
                          onClick={() => updateCandidateDecision(score.id, 'shortlist')}
                          disabled={updatingDecision === score.id}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${getDecisionButtonClass(score.decision, 'shortlist')}`}
                          title="Shortlist"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => updateCandidateDecision(score.id, 'reject')}
                          disabled={updatingDecision === score.id}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${getDecisionButtonClass(score.decision, 'reject')}`}
                          title="Reject"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {score.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateCandidateStatus(score.id, 'next_round')}
                              disabled={updatingStatus === score.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              Next Round
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => updateCandidateStatus(score.id, 'rejected')}
                              disabled={updatingStatus === score.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {score.status !== 'pending' && (
                          <button
                            onClick={() => updateCandidateStatus(score.id, 'pending')}
                            disabled={updatingStatus === score.id}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
