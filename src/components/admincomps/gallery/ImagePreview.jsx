// components/gallery/ImagePreview.jsx
import React from 'react';
import { MdClose } from 'react-icons/md';

const ImagePreview = ({ imageUrl, onRemove }) => {
  if (!imageUrl) return null;
  
  return (
    <div className="relative mt-2 rounded-md overflow-hidden border border-gray-200">
      <div className="relative w-full h-48 bg-gray-100">
        <img 
          src={imageUrl} 
          alt="Gallery Preview" 
          className="w-full h-full object-cover" 
        />
        
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 hover:bg-opacity-100"
            aria-label="Remove image"
          >
            <MdClose className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
      
      <div className="p-2 bg-white text-xs text-gray-500">
        {imageUrl.split('/').pop()?.substring(0, 30)}
        {imageUrl.split('/').pop()?.length > 30 ? '...' : ''}
      </div>
    </div>
  );
};

export default ImagePreview;