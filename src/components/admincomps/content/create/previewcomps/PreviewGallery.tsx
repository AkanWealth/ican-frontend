import React from "react";
import Image from "next/image";

function PreviewGallery({
  name,
  images,
  videos,
  showPreview,
  setShowPreview,
}: {
  name: string;
  images: string[];
  videos: string[];
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowPreview(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">{name}</h2>

          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative h-40 w-full">
                    <Image
                      src={img}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {videos.map((vid, index) => (
                  <div key={index} className="aspect-video">
                    <video
                      src={vid}
                      controls
                      className="w-full h-full rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewGallery;
