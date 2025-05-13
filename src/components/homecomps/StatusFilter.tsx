'use client';
import React, { useRef, useEffect } from 'react';
import { XCircle, TriangleAlert, CheckCircle, ListFilter } from 'lucide-react';

interface StatusFilterProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (status: string | null) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ isOpen, onClose, onSelect }) => {
    const statusRef = useRef<HTMLDivElement | null>(null);

    // Status options
    const statusOptions = [
        { value: "UNPAID", label: "Unpaid", icon: <XCircle className="h-4 w-4 text-red-500" /> },
        { value: "PENDING", label: "Pending", icon: <TriangleAlert className="h-4 w-4 text-yellow-500" /> },
        { value: "PARTIALLY_PAID", label: "Partially Paid", icon: <TriangleAlert className="h-4 w-4 text-yellow-500" /> },
        { value: "FULLY_PAID", label: "Fully Paid", icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
        { value: null, label: "All Statuses", icon: <ListFilter className="h-4 w-4 text-gray-500" /> }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
                onClose(); // Close status filter if clicked outside
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={statusRef} className="absolute top-full right-0 bg-white rounded-xl shadow-lg border border-gray-200 w-[240px] p-4 z-50">
            <div className="font-medium text-sm text-gray-700 pb-2 border-b mb-2">Select Status:</div>
            <div className="flex flex-col gap-1">
                {statusOptions.map((status, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            onSelect(status.value);
                            onClose();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-md"
                    >
                        {status.icon}
                        <span>{status.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StatusFilter;