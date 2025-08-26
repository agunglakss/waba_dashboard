// src/components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center border-r border-gray-200 pr-5">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-blue-400"
            >
              WABA Analytics
            </Link>
          </div>

          {/* Right Menu */}
          {/* <div className="flex items-center space-x-6 border-l border-gray-200 pl-5">
            <Link
              href="/about"
              className="inline-flex items-center text-sm py-2 px-5 border border-blue-400 rounded-md text-blue-400 hover:border-blue-600 hover:text-white hover:bg-blue-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                />
              </svg>
              Logout
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
}
