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
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Step indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                1
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Select Position</p>
              </div>
            </div>
            <div className="flex-1 mx-4 h-px bg-gray-200"></div>
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                2
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Configure</p>
              </div>
            </div>
            <div className="flex-1 mx-4 h-px bg-gray-200"></div>
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                3
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Review</p>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                Select Position
              </label>
              <select
                id="position"
                name="position"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Choose a position...</option>
                <option value="1">Senior Software Engineer - Engineering</option>
                <option value="2">Product Manager - Product</option>
                <option value="3">UX Designer - Design</option>
              </select>
            </div>

            <div>
              <label htmlFor="customRequirements" className="block text-sm font-medium text-gray-700">
                Custom Requirements (Optional)
              </label>
              <textarea
                id="customRequirements"
                name="customRequirements"
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Add any additional requirements or criteria for this analysis..."
              />
              <p className="mt-2 text-sm text-gray-500">
                These requirements will be considered in addition to the position's standard requirements
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">About AI Analysis</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      The AI will analyze all candidate resumes and score them based on:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Match with position requirements</li>
                      <li>Relevant experience and skills</li>
                      <li>Custom requirements you specify</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Start Analysis
              </button>
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
