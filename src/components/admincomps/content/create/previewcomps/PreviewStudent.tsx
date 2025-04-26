import React from "react";

import Studenttile from "@/components/genui/Studenttile";

function PreviewStudent({
  name,
  document,
  showPreview,
  setShowPreview,
}: {
  name: string;
  document: string;
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
          <Studenttile
            imageUrl="/studenthero.png"
            title={name}
            fileType="PDF"
            downloadLink={document}
          />
        </div>
      </div>
    </div>
  );
}

export default PreviewStudent;
