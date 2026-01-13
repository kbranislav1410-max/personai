'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Position = {
  id: number;
  title: string;
  department: string;
  seniority: string;
};

type UploadedFile = {
  file: File;
  candidateId: number;
  status: 'pending' | 'uploading' | 'uploaded' | 'extracting' | 'completed' | 'error';
  resumeId?: number;
  error?: string;
};

type AnalysisResult = {
  candidateId: number;
  candidateName: string;
  score: number;
  recommendation: 'Strong Match' | 'Good Match' | 'Potential Match' | 'Weak Match';
  summary: string;
};

type CandidateScoreResult = {
  id: number;
  score: number;
  recommendation: string;
  summary: string;
  Candidate: {
    id: number;
    fullName: string;
  };
};

function AnalysisWizard() {
  const searchParams = useSearchParams();
  const preselectedPositionId = searchParams.get('positionId');

  const [step, setStep] = useState(1);
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string>(preselectedPositionId || '');
  const [customRequirements, setCustomRequirements] = useState('');
  const [mustHaveWeight, setMustHaveWeight] = useState(70);
  const [niceToHaveWeight, setNiceToHaveWeight] = useState(20);
  const [customWeight, setCustomWeight] = useState(10);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions');
      const data = await response.json();
      if (data.ok) {
        setPositions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = files.map((file, index) => ({
      file,
      candidateId: Date.now() + index, // Mock candidate ID
      status: 'pending',
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleUploadAndExtract = async (fileIndex: number) => {
    const fileData = uploadedFiles[fileIndex];
    setUploadedFiles(files => files.map((f, i) => 
      i === fileIndex ? { ...f, status: 'uploading' } : f
    ));

    try {
      // Upload file
      const formData = new FormData();
      formData.append('files', fileData.file);
      formData.append('candidateId', fileData.candidateId.toString());

      const uploadResponse = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      const resumeId = uploadData.data.resumes[0].id;

      setUploadedFiles(files => files.map((f, i) => 
        i === fileIndex ? { ...f, status: 'uploaded', resumeId } : f
      ));

      // Extract text
      setUploadedFiles(files => files.map((f, i) => 
        i === fileIndex ? { ...f, status: 'extracting' } : f
      ));

      const extractResponse = await fetch(`/api/resumes/${resumeId}/extract-text`, {
        method: 'POST',
      });

      const extractData = await extractResponse.json();

      if (!extractData.ok) {
        throw new Error(extractData.error || 'Extraction failed');
      }

      setUploadedFiles(files => files.map((f, i) => 
        i === fileIndex ? { ...f, status: 'completed' } : f
      ));

    } catch (error) {
      setUploadedFiles(files => files.map((f, i) => 
        i === fileIndex ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' } : f
      ));
    }
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    
    try {
      // Step 1: Create analysis run
      const createResponse = await fetch('/api/analysis-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionId: parseInt(selectedPositionId),
          customRequirements: customRequirements || '',
        }),
      });

      const createData = await createResponse.json();
      
      if (!createData.ok) {
        throw new Error(createData.error || 'Failed to create analysis run');
      }

      const analysisRunId = createData.data.id;

      // Step 2: Run the analysis with scoring engine
      const runResponse = await fetch(`/api/analysis-runs/${analysisRunId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weights: {
            mustHave: mustHaveWeight,
            niceToHave: niceToHaveWeight,
            custom: customWeight,
          },
        }),
      });

      const runData = await runResponse.json();

      if (!runData.ok) {
        throw new Error(runData.error || 'Failed to run analysis');
      }

      // Step 3: Process results
      const candidateScores: CandidateScoreResult[] = runData.data.analysisRun.CandidateScore || [];
      
      const results: AnalysisResult[] = candidateScores.map((cs) => {
        let recommendation: 'Strong Match' | 'Good Match' | 'Potential Match' | 'Weak Match';
        
        if (cs.recommendation === 'yes') {
          recommendation = 'Strong Match';
        } else if (cs.recommendation === 'maybe') {
          recommendation = cs.score >= 60 ? 'Good Match' : 'Potential Match';
        } else {
          recommendation = 'Weak Match';
        }

        return {
          candidateId: cs.Candidate.id,
          candidateName: cs.Candidate.fullName,
          score: cs.score,
          recommendation,
          summary: cs.summary,
        };
      });

      setAnalysisResults(results);
      setStep(4);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to run analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepNum: number) => {
    if (stepNum < step) return 'completed';
    if (stepNum === step) return 'current';
    return 'upcoming';
  };

  const renderStepIndicator = () => {
    const steps = [
      { num: 1, name: 'Position' },
      { num: 2, name: 'Requirements' },
      { num: 3, name: 'Upload' },
      { num: 4, name: 'Results' },
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => {
          const status = getStepStatus(s.num);
          return (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                    status === 'completed'
                      ? 'bg-green-600 text-white'
                      : status === 'current'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {status === 'completed' ? '✓' : s.num}
                </div>
                <div className="ml-3">
                  <p
                    className={`text-sm font-medium ${
                      status === 'upcoming' ? 'text-gray-500' : 'text-gray-900'
                    }`}
                  >
                    {s.name}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 mx-4 h-px ${
                    status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
          Select Position <span className="text-red-500">*</span>
        </label>
        <select
          id="position"
          value={selectedPositionId}
          onChange={(e) => setSelectedPositionId(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Choose a position...</option>
          {positions.map((pos) => (
            <option key={pos.id} value={pos.id}>
              {pos.title} - {pos.department}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          disabled={!selectedPositionId}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Requirements
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="customRequirements" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Requirements (Optional)
        </label>
        <textarea
          id="customRequirements"
          value={customRequirements}
          onChange={(e) => setCustomRequirements(e.target.value)}
          rows={4}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Add any additional requirements or criteria for this analysis..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900">Scoring Weights</h3>
        
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">Must-Have Requirements</label>
            <span className="text-sm font-medium text-gray-900">{mustHaveWeight}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mustHaveWeight}
            onChange={(e) => {
              const newVal = parseInt(e.target.value);
              const remaining = 100 - newVal;
              setMustHaveWeight(newVal);
              setNiceToHaveWeight(Math.floor(remaining * 0.67));
              setCustomWeight(remaining - Math.floor(remaining * 0.67));
            }}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">Nice-To-Have Requirements</label>
            <span className="text-sm font-medium text-gray-900">{niceToHaveWeight}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={niceToHaveWeight}
            onChange={(e) => {
              const newVal = parseInt(e.target.value);
              const remaining = 100 - newVal;
              setNiceToHaveWeight(newVal);
              setMustHaveWeight(Math.floor(remaining * 0.7));
              setCustomWeight(remaining - Math.floor(remaining * 0.7));
            }}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm text-gray-700">Custom Requirements</label>
            <span className="text-sm font-medium text-gray-900">{customWeight}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={customWeight}
            onChange={(e) => {
              const newVal = parseInt(e.target.value);
              const remaining = 100 - newVal;
              setCustomWeight(newVal);
              setMustHaveWeight(Math.floor(remaining * 0.7));
              setNiceToHaveWeight(remaining - Math.floor(remaining * 0.7));
            }}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Next: Upload Resumes
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resumes <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-2 text-sm text-gray-500">
          Upload PDF or DOCX files (max 5MB each)
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Uploaded Files</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: {file.status === 'pending' && 'Pending'}
                  {file.status === 'uploading' && 'Uploading...'}
                  {file.status === 'uploaded' && 'Uploaded'}
                  {file.status === 'extracting' && 'Extracting text...'}
                  {file.status === 'completed' && '✓ Ready'}
                  {file.status === 'error' && `Error: ${file.error}`}
                </p>
              </div>
              {file.status === 'pending' && (
                <button
                  onClick={() => handleUploadAndExtract(index)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Upload & Extract
                </button>
              )}
              {file.status === 'completed' && (
                <span className="text-green-600 font-medium">✓</span>
              )}
              {file.status === 'error' && (
                <button
                  onClick={() => handleUploadAndExtract(index)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Retry
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleRunAnalysis}
          disabled={uploadedFiles.length === 0 || !uploadedFiles.every(f => f.status === 'completed')}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Running Analysis...' : 'Run Analysis'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="rounded-lg bg-green-50 p-4 border border-green-200">
        <p className="text-sm text-green-800">
          ✓ Analysis completed successfully! Analyzed {analysisResults.length} candidate(s).
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Recommendation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Summary
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {analysisResults.map((result) => (
              <tr key={result.candidateId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.candidateName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-semibold text-blue-600">{result.score}</span>
                  <span className="text-sm text-gray-500">/100</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      result.recommendation === 'Strong Match'
                        ? 'bg-green-100 text-green-800'
                        : result.recommendation === 'Good Match'
                        ? 'bg-blue-100 text-blue-800'
                        : result.recommendation === 'Potential Match'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {result.recommendation}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                  {result.summary}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => {
            setStep(1);
            setSelectedPositionId('');
            setCustomRequirements('');
            setUploadedFiles([]);
            setAnalysisResults([]);
          }}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Start New Analysis
        </button>
        <button
          onClick={() => window.location.href = '/analysis-runs'}
          className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View All Analyses
        </button>
      </div>
    </div>
  );

  return (
    <>
      {renderStepIndicator()}

      <div className="mt-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </>
  );
}

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Analysis Wizard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Run AI-powered analysis to match candidates with positions
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <Suspense fallback={<div className="text-center py-8 text-gray-600">Loading...</div>}>
            <AnalysisWizard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
