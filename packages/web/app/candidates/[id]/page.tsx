'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface CandidateScore {
  id: number;
  score: number;
  recommendation: string;
  summary: string;
  strengths: string;
  gaps: string;
  status: string;
  AnalysisRun: {
    id: number;
    createdAt: string;
    Position: {
      id: number;
      title: string;
      department: string;
    };
  };
}

interface Resume {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
  rawText: string;
}

interface Candidate {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  createdAt: string;
  Resume: Resume[];
  CandidateScore: CandidateScore[];
}

export default function CandidateDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchCandidate();
    }
  }, [id]);

  const fetchCandidate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/candidates/${id}`);
      const result = await response.json();

      if (result.ok) {
        setCandidate(result.data);
      } else {
        setError(result.error || 'Failed to load candidate');
      }
    } catch (err) {
      setError('Failed to load candidate');
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

  const getLatestScore = () => {
    if (!candidate || candidate.CandidateScore.length === 0) return null;
    return candidate.CandidateScore.reduce((latest, score) =>
      new Date(score.AnalysisRun.createdAt) > new Date(latest.AnalysisRun.createdAt)
        ? score
        : latest
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading candidate...</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{error || 'Candidate not found'}</p>
        </div>
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-900"
        >
          ← Back to Candidates
        </Link>
      </div>
    );
  }

  const latestScore = getLatestScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/candidates"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-900 mb-2"
        >
          ← Back to Candidates
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-blue-700">
              {candidate.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.fullName}</h1>
            <p className="text-sm text-gray-600">
              Joined {formatDate(candidate.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{candidate.email || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{candidate.phone || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900">{candidate.location || 'N/A'}</dd>
          </div>
        </dl>
      </div>

      {/* Latest Score */}
      {latestScore && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Latest Analysis Score</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-2">Position</div>
              <Link
                href={`/positions/${latestScore.AnalysisRun.Position.id}`}
                className="text-blue-600 hover:text-blue-900 font-medium"
              >
                {latestScore.AnalysisRun.Position.title}
              </Link>
              <div className="text-sm text-gray-600 mt-1">
                {latestScore.AnalysisRun.Position.department}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Score</div>
                <div className="text-3xl font-bold text-gray-900">{latestScore.score}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Recommendation</div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    getRecommendationBadge(latestScore.recommendation).className
                  }`}
                >
                  {getRecommendationBadge(latestScore.recommendation).label}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Status</div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    getStatusBadge(latestScore.status).className
                  }`}
                >
                  {getStatusBadge(latestScore.status).label}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Summary</div>
            <p className="text-sm text-gray-700">{latestScore.summary}</p>
          </div>
        </div>
      )}

      {/* Resumes */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Resumes ({candidate.Resume.length})
        </h2>
        {candidate.Resume.length === 0 ? (
          <p className="text-sm text-gray-600">No resumes uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {candidate.Resume.map(resume => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">{resume.fileName}</div>
                  <div className="text-xs text-gray-600">
                    Uploaded {formatDate(resume.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 uppercase">{resume.fileType}</span>
                  {resume.fileUrl && (
                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-900"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis History */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Analysis History ({candidate.CandidateScore.length})
        </h2>
        {candidate.CandidateScore.length === 0 ? (
          <p className="text-sm text-gray-600">No analysis runs yet.</p>
        ) : (
          <div className="space-y-4">
            {candidate.CandidateScore.sort((a, b) =>
              new Date(b.AnalysisRun.createdAt).getTime() -
              new Date(a.AnalysisRun.createdAt).getTime()
            ).map(score => {
              const recommendationBadge = getRecommendationBadge(score.recommendation);
              const statusBadge = getStatusBadge(score.status);
              return (
                <div
                  key={score.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Link
                        href={`/analysis-runs/${score.AnalysisRun.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        {score.AnalysisRun.Position.title}
                      </Link>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatDate(score.AnalysisRun.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">Score</div>
                        <div className="text-lg font-bold text-gray-900">{score.score}</div>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${recommendationBadge.className}`}>
                          {recommendationBadge.label}
                        </span>
                      </div>
                      <div>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusBadge.className}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{score.summary}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
