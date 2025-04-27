import React from "react";

import TechnicalTile from "@/components/pubntech/TechnicalTile";

function PreviewTechnical({
  name,
  document,
  coverImg,
  showPreview,
  setShowPreview,
}: {
  name: string;
  document: string;
  coverImg: string;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <button
          onClick={() => setShowPreview(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="flex flex-col gap-4">
          <TechnicalTile
            post={{
              title: name,
              document: document,
              coverImg: coverImg,
              date: new Date().toISOString(),
              category: "Technical Session",
              downloadLink: document,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default PreviewTechnical;
