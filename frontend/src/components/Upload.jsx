import { useState } from 'react';
import { UploadCloud, X, Check, AlertCircle } from 'lucide-react';

import { API_BASE } from "../api"; 

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setError(null);
    setResult(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/index-photo`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during upload');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const clearUpload = () => {
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Image</h2>

      {/* Upload Area */}
      {!preview && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Supports JPG, PNG, GIF (max 10MB)
          </p>
          <label className="inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              className="hidden"
              disabled={uploading}
            />
            <span className="px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
              Select Image
            </span>
          </label>
        </div>
      )}

      {/* Preview and Status */}
      {preview && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={clearUpload}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              disabled={uploading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Loading State */}
          {uploading && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 font-medium">Uploading...</span>
            </div>
          )}

          {/* Success State */}
          {result && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 mb-1">
                    Upload Successful
                  </h3>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">File:</span> {result.filename}
                  </p>
                  {result.caption && (
                    <p className="text-sm text-green-700 mt-1">
                      <span className="font-medium">Caption:</span>{' '}
                      {result.caption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">
                    Upload Failed
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}