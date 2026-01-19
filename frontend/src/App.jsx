
import { useState } from "react";
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Upload from "./components/Upload";
import Search from "./components/Search";
import Results from "./components/Results";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [images, setImages] = useState([]);

  const renderHome = () => (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Semantic Photo Search
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Search your photos using natural language. Find images by describing what you're looking for.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div
          onClick={() => setCurrentView("upload")}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-blue-500"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
            <UploadIcon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-2">Upload Photos</h3>
          <p className="text-gray-600 mb-4">
            Upload your photo collection to enable semantic search capabilities.
          </p>
          <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        <div
          onClick={() => setCurrentView("search")}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-purple-500"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
            <SearchIcon className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-2">Search Images</h3>
          <p className="text-gray-600 mb-4">
            Use natural language to find exactly what you're looking for in your photos.
          </p>
          <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
            Start Searching <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>

        <div
          onClick={() => setCurrentView("gallery")}
          className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-green-500"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
            <ImageIcon className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-xl font-bold mb-2">View Gallery</h3>
          <p className="text-gray-600 mb-4">
            Browse all your uploaded photos and previous search results.
          </p>
          <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
            View Gallery <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Upload</h4>
              <p className="text-sm text-gray-600">Add your photos to the system</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Describe</h4>
              <p className="text-sm text-gray-600">Use natural language to search</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Discover</h4>
              <p className="text-sm text-gray-600">Find relevant photos instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentView("home")}
              className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <Sparkles className="w-6 h-6" />
              Semantic Search
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView("upload")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "upload"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Upload
              </button>
              <button
                onClick={() => setCurrentView("search")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "search"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Search
              </button>
              <button
                onClick={() => setCurrentView("gallery")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "gallery"
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Gallery
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {currentView === "home" && renderHome()}
        {currentView === "upload" && <Upload />}
        {currentView === "search" && <Search onResults={setImages} />}
        {currentView === "gallery" && <Results images={images} />}
      </main>
    </div>
  );
}
