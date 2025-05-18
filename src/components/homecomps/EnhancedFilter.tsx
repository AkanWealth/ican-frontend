'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ListFilter, Calendar } from 'lucide-react';
import CalendarFilter from './CalendarFilter';
import StatusFilter from './StatusFilter';

interface EnhancedFilterProps {
    onStatusFilter: (status: string | null) => void;
    onDateFilter: (date: string) => void;
    onResetFilter: () => void;
}

const EnhancedFilter: React.FC<EnhancedFilterProps> = ({ onStatusFilter, onDateFilter, onResetFilter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [filterType, setFilterType] = useState<'date' | 'status' | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleStatusSelect = (status: string | null) => {
        onStatusFilter(status);
        setIsStatusOpen(false);
        setFilterType(null);
    };

    const handleDateSelect = (date: string) => {
        onDateFilter(date);
        setIsCalendarOpen(false);
        setFilterType(null);
    };

    const toggleFilterType = (type: 'date' | 'status') => {
        // Close main dropdown
        setIsOpen(false);
        
        if (type === 'date') {
            setIsCalendarOpen(true);
            setIsStatusOpen(false);
        } else if (type === 'status') {
            setIsCalendarOpen(false);
            setIsStatusOpen(true);
        }
        
        setFilterType(type);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-50"
            >
                <ListFilter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                        <div className="font-medium text-sm text-gray-700 pb-2 border-b">Filter By:</div>
                        
                        {/* Filter by Date Option */}
                        <button
                            onClick={() => toggleFilterType('date')}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-md ${filterType === 'date' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            <Calendar className="h-4 w-4" />
                            <span>Date</span>
                        </button>
                        
                        {/* Filter by Status Option */}
                        <button
                            onClick={() => toggleFilterType('status')}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-md ${filterType === 'status' ? 'bg-blue-50 text-blue-600' : ''}`}
                        >
                            <ListFilter className="h-4 w-4" />
                            <span>Status</span>
                        </button>
                        
                        {/* Reset Filter Option */}
                        <div className="border-t my-1 pt-1">
                            <button
                                onClick={() => {
                                    onResetFilter();
                                    setIsOpen(false);
                                    setFilterType(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                                <span>Reset Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Calendar Filter Component */}
            <CalendarFilter
                isOpen={isCalendarOpen && filterType === 'date'}
                onClose={() => {
                    setIsCalendarOpen(false);
                    setFilterType(null);
                }}
                onSelect={handleDateSelect}
            />
            
            {/* Status Filter Component */}
            <StatusFilter 
                isOpen={isStatusOpen && filterType === 'status'}
                onClose={() => {
                    setIsStatusOpen(false);
                    setFilterType(null);
                }}
                onSelect={handleStatusSelect}
            />
        </div>
    );
};

export default EnhancedFilter;