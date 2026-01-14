import { useState, useEffect, useRef } from 'react';
import { SearchIcon, Loader2, XCircle } from 'lucide-react';
import { API_BASE } from "../api";
 // Replace with your actual API base

export default function Search({ onResults, onError }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      onResults([]);
      setError(null);
      return;
    }

    // Cancel previous request if still pending
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_BASE}/search?query=${encodeURIComponent(searchQuery)}`,
        { signal: abortController.current.signal }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Search failed');
      }

      const data = await res.json();
      onResults(data.results || []);
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled, ignore
      }
      
      const errorMsg = err.message || 'Failed to search images';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce search by 400ms
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 400);
  };

  const handleClear = () => {
    setQuery('');
    setError(null);
    onResults([]);
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (abortController.current) {
      abortController.current.abort();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Search Images</h2>
      
      <div className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          <input
            type="text"
            placeholder="Search your images by description..."
            className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            value={query}
            onChange={handleInputChange}
            disabled={loading}
          />

          {/* Loading or Clear button */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : query ? (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <XCircle className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Search hint */}
        {!query && !error && (
          <p className="mt-3 text-sm text-gray-500">
            Try searching for objects, colors, scenes, or descriptions
          </p>
        )}
      </div>
    </div>
  );
}