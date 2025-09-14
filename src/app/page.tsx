// import Link from 'next/link'; // Will be used when routes are created

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Welcome to{' '}
            <span className="text-indigo-600">Esahayak</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Professional buyer lead intake and management system for real estate professionals.
            Capture, manage, and convert leads efficiently.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled
            >
              Manage Leads (Coming Soon)
            </button>
            <button
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 disabled:opacity-50"
              disabled
            >
              Add New Lead <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Lead Management</h3>
              <p className="mt-2 text-gray-600">
                Capture and organize buyer leads with comprehensive information and search capabilities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Import & Export</h3>
              <p className="mt-2 text-gray-600">
                Bulk import leads from CSV files and export filtered data for analysis.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Status Tracking</h3>
              <p className="mt-2 text-gray-600">
                Track lead progression through your sales pipeline with detailed history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}