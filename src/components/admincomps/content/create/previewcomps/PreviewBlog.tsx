import React from "react";

function PreviewBlog({
  title,
  authorName,
  contentBody,
  showPreview,
  setShowPreview,
}: {
  title: string;
  authorName: string;
  contentBody: string;
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
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-600">{authorName}</p>
          <div dangerouslySetInnerHTML={{ __html: contentBody }} />
        </div>
      </div>
    </div>
  );
}

export default PreviewBlog;