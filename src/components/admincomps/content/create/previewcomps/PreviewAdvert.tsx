import React from "react";
import Image from "next/image";

function PreviewAdvert({
  name,
  advertiser,
  image,
  textBody,
  startDate,
  endDate,
  showPreview,
  setShowPreview,
}: {
  name: string;
  advertiser: string;
  image: string;
  textBody: string;
  startDate: string;
  endDate: string;
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
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-600">{advertiser}</p>
          <div className="relative w-full h-64">
            <Image 
              src={image} 
              alt={name} 
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: textBody }} />
          <p className="text-gray-600">{startDate}</p>
          <p className="text-gray-600">{endDate}</p>
        </div>
      </div>
    </div>
  );
}

export default PreviewAdvert;
