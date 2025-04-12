'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: string) => void;
}

const CalendarFilter: React.FC<CalendarProps> = ({ isOpen, onClose, onSelect }) => {
    const [selectedMonth, setSelectedMonth] = useState('July');
    const [selectedYear, setSelectedYear] = useState('2023');
    const [currentView, setCurrentView] = useState('July 2023');
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [viewedYear, setViewedYear] = useState(2023);
    const [viewedMonth, setViewedMonth] = useState(6);
    const calendarRef = useRef<HTMLDivElement | null>(null);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                onClose(); // Close calendar if clicked outside
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


    const getMonthDetails = () => {
        const firstDay = new Date(`${selectedMonth} 1, ${selectedYear}`).getDay();
        const daysInMonth = new Date(parseInt(selectedYear), months.indexOf(selectedMonth) + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getMonthDetails();

    const generateCalendarDays = () => {
        const days = [];
        const { firstDay, daysInMonth } = getMonthDetails();

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = day;
            days.push(
                <button
                    key={`day-${day}`}
                    onClick={() => {
                        setSelectedDate(currentDay);
                        onSelect(`${selectedMonth} ${currentDay}, ${selectedYear}`);
                    }}
                    className={`text-sm p-2 rounded-full text-center
        hover:bg-blue-50 
        ${selectedDate === currentDay ? 'bg-blue-100 text-blue-600' : ''}`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const currentMonthIndex = months.indexOf(selectedMonth);
        let newMonth: string;
        let newYear = parseInt(selectedYear);

        if (direction === 'next') {
            if (currentMonthIndex === 11) {
                newMonth = months[0];
                newYear += 1;
            } else {
                newMonth = months[currentMonthIndex + 1];
            }
        } else {
            if (currentMonthIndex === 0) {
                newMonth = months[11];
                newYear -= 1;
            } else {
                newMonth = months[currentMonthIndex - 1];
            }
        }

        setSelectedMonth(newMonth);
        setSelectedYear(newYear.toString());
        setCurrentView(`${newMonth} ${newYear}`);
        setSelectedDate(null);
    };

    const handleYearChange = (direction: 'prev' | 'next') => {
        let newYear = viewedYear;
        if (direction === 'next') {
            newYear += 1;
        } else {
            newYear -= 1;
        }
        setViewedYear(newYear);
    };
    const handleMonthNavigation = (direction: 'prev' | 'next') => {
        let newMonth = viewedMonth;
        if (direction === 'next') {
            newMonth = (newMonth + 1) % 12;
        } else {
            newMonth = (newMonth - 1 + 12) % 12;
        }
        setViewedMonth(newMonth);
    };

    const handleMonthYearSelect = (month?: string, year?: string) => {
        if (month) setSelectedMonth(month);
        if (year) setSelectedYear(year);
        setCurrentView(`${month || selectedMonth} ${year || selectedYear}`);

    };

    if (!isOpen) return null;

    return (
        <div
        ref={calendarRef}
         className="flex">

            <div
                className={`absolute top-full right-0 bg-white rounded-xl shadow-lg border border-gray-200 w-[320px] p-4 z-50 ${isOpen ? "block" : "hidden"
                    }`}>

                <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => setShowYearSelector(!showYearSelector)}
                            className="text-gray-800 hover:text-gray-800 flex items-center gap-1 font-semibold"
                        >
                            {currentView} <ChevronDown className="h-4 w-4 text-primary" />
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleMonthChange('prev')}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft className="h-4 w-4 text-primary" />
                            </button>
                            <button
                                onClick={() => handleMonthChange('next')}
                                className="p-1 hover:bg-gray-100 rounded text-primary"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                            <div key={day} className="text-xs text-gray-500 text-center py-1">
                                {day}
                            </div>
                        ))}
                        {generateCalendarDays()}
                    </div>
                </div>


            </div>

            {showYearSelector && (
                <div
                className={`absolute top-full right-80 bg-white rounded-xl shadow-lg border border-gray-200 w-[320px] p-4 mr-4 z-50`}
              >              

                    <div className="mb-4">
                        <button
                            className="text-gray-800 hover:text-gray-800 flex items-center gap-1 font-semibold mb-4"
                        >
                            {currentView} <ChevronUp className="h-4 w-4 text-primary" />
                        </button>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className='text-sm text-gray-800 text-semibold'>Month</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleMonthNavigation('prev')}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <ChevronLeft className="h-4 w-4 text-primary" />
                                </button>
                                <button
                                    onClick={() => handleMonthNavigation('next')}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: 4 }, (_, i) => (viewedMonth - 1 + i + 12) % 12).map(monthIndex => (
                                <button
                                    key={monthIndex}
                                    onClick={() => handleMonthYearSelect(months[monthIndex])}
                                    className={`p-2 text-xs rounded-lg
                                        ${months[monthIndex] === selectedMonth ? 'bg-blue-100 text-blue-600 border border-blue-300' : 'hover:bg-gray-50 bg-gray-100 border border-gray-200'}`}
                                >
                                    {months[monthIndex]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className='text-sm text-gray-800 text-semibold'>Year</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleYearChange('prev')}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <ChevronLeft className="h-4 w-4 text-primary" />
                                </button>
                                <button
                                    onClick={() => handleYearChange('next')}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <ChevronRight className="h-4 w-4 text-primary" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {Array.from({ length: 4 }, (_, i) => viewedYear + i).map(year => (
                                <button
                                    key={year}
                                    onClick={() => handleMonthYearSelect(undefined, year.toString())}
                                    className={`p-2 text-xs rounded-lg 
                    ${year.toString() === selectedYear ? 'bg-blue-200 text-blue-600 border border-blue-300' : 'hover:bg-gray-50 bg-gray-200 border border-gray-300'}`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowYearSelector(false); // Close the modal only when "Done" is clicked
                                }}
                                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-700 flex-1"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarFilter;