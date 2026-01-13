export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 bg-white px-6 lg:px-8">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Placeholder for breadcrumbs or page title */}
          <h2 className="text-lg font-semibold text-gray-900">
            HR CV Analyzer
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Placeholder for user menu or actions */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
