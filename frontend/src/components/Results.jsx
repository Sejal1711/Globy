import { useState } from 'react';
import { Download, Maximize2, X, Image } from 'lucide-react';

export default function Results({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [errorImages, setErrorImages] = useState({});

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    setErrorImages(prev => ({ ...prev, [index]: true }));
  };

  const handleDownload = async (url, index) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `image-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const openLightbox = (image, index) => {
    setSelectedImage({ url: image, index });
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (selectedImage) {
      if (e.key === 'ArrowRight' && selectedImage.index < images.length - 1) {
        setSelectedImage({ url: images[selectedImage.index + 1], index: selectedImage.index + 1 });
      } else if (e.key === 'ArrowLeft' && selectedImage.index > 0) {
        setSelectedImage({ url: images[selectedImage.index - 1], index: selectedImage.index - 1 });
      }
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-xl mt-6">
        <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No images found</p>
        <p className="text-gray-400 text-sm mt-2">Try uploading some images or adjusting your search</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {images.length} {images.length === 1 ? 'Result' : 'Results'}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Loading skeleton */}
              {!loadedImages[i] && !errorImages[i] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}

              {/* Error state */}
              {errorImages[i] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Image className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400">Failed to load</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Image */}
                  <img
                    src={url}
                    alt={`Result ${i + 1}`}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
                    onLoad={() => handleImageLoad(i)}
                    onError={() => handleImageError(i)}
                    onClick={() => openLightbox(url, i)}
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(url, i);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="View full size"
                    >
                      <Maximize2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(url, i);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Download image"
                    >
                      <Download className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage.url, selectedImage.index);
              }}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white">
              {selectedImage.index + 1} / {images.length}
            </span>
          </div>

          <img
            src={selectedImage.url}
            alt={`Image ${selectedImage.index + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation arrows */}
          {selectedImage.index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({ url: images[selectedImage.index - 1], index: selectedImage.index - 1 });
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <span className="text-white text-2xl">‹</span>
            </button>
          )}
          {selectedImage.index < images.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({ url: images[selectedImage.index + 1], index: selectedImage.index + 1 });
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
              aria-label="Next image"
            >
              <span className="text-white text-2xl">›</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}