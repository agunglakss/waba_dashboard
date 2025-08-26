"use client";
import { useState, useEffect, useCallback } from "react";
import { DetailAnalyticModal } from "./DetailAnalyticModal";

type Waba = {
  waba_id: string;
  name: string;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  offset: number;
};

export default function WabaTable({ 
  data: initialData
}: { 
  data: Waba[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWabaId, setSelectedWabaId] = useState<string | null>(null);
  const [data, setData] = useState<Waba[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: initialData.length,
    limit: 10,
    offset: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number, limit: number = 10, search: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      // Add search parameter if provided
      if (search.trim()) {
        params.append('search', search.trim());
      }
      
      const response = await fetch(`/api/search/customers?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.data) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when component mounts
  useEffect(() => {
    console.log('Table component mounted, fetching data...');
    fetchData(1, 10);
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchData(page, pagination.limit, searchTerm);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    fetchData(1, pagination.limit, searchTerm);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchData(1, pagination.limit, "");
  };

  const handleOpenDetail = (wabaId: string) => {
    setSelectedWabaId(wabaId);
    setIsOpen(true);
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, pagination.currentPage - 2);
      const end = Math.min(pagination.totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
          <form onSubmit={handleSearch} className="mb-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 border p-4 rounded-lg">
            <div className="sm:col-span-2">
              <input 
                type="text" 
                placeholder="Search by WABA ID or WABA Name" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || isSearching}
                className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  disabled={loading}
                  className="cursor-pointer px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">WABA ID</th>
                <th className="px-4 py-3 text-left">WABA Name</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center">
                    <div className="text-red-500 mb-3">
                      <p className="font-medium">Error loading data</p>
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                    <button
                      onClick={() => fetchData(1, 10, searchTerm)}
                      className="px-4 py-2 rounded-md border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? `No customers found matching "${searchTerm}"` : 'No WABA data available'}
                  </td>
                </tr>
              ) : (
                data.map((waba) => (
                  <tr key={waba.waba_id}>
                    <td className="px-4 py-3">{waba.waba_id}</td>
                    <td className="px-4 py-3">{waba.name}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenDetail(waba.waba_id)}
                        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-sm hover:bg-blue-700 transition cursor-pointer"
                      >
                        See Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {pagination.totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                `Showing ${pagination.offset + 1} to ${Math.min(pagination.offset + pagination.limit, pagination.totalCount)} of ${pagination.totalCount} entries${searchTerm ? ` for "${searchTerm}"` : ''}`
              )}
            </p>

            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {generatePageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    page === pagination.currentPage
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:bg-blue-50'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages || loading}
                className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      
      {pagination.totalPages === 1 && pagination.totalCount > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <p className="text-sm text-gray-600 text-center">
            Showing all {pagination.totalCount} entries{searchTerm ? ` for "${searchTerm}"` : ''}
          </p>
        </div>
      )}

      <DetailAnalyticModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        wabaId={selectedWabaId || undefined}
      />
    </section>
  );
}