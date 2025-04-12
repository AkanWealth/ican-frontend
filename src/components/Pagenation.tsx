'use client';
import React from 'react';
import { ArrowRight,ArrowLeft } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 4
}) => {
  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show the first page
    if (currentPage > 3) {
      pageNumbers.push(1);
      if (currentPage > 4) {
        pageNumbers.push('...');
      }
    }
    
    // Calculate range of page numbers to show around current page
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Always show the last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center mt-6 mb-4">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400"
      >
        <ArrowLeft 
          className="mr-1 h-4 w-4"
        />
          
        Previous
      </button>
      
      <div className="flex items-center mx-2">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 mx-1 text-sm rounded-md ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-gray-600">
              {page}
            </span>
          )
        ))}
      </div>
      
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400"
      >
        Next
        <ArrowRight 
          className="ml-1 h-4 w-4"
        />
       
      </button>
    </div>
  );
};

export default TablePagination;