// 'use client';
// import React, { useRef, useState, useEffect } from 'react';
// import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

// interface CalendarProps {
//     isOpen: boolean;
//     onClose: () => void;
//     onSelect: (date: string) => void;
// }

// const CalendarFilter: React.FC<CalendarProps> = ({ isOpen, onClose, onSelect }) => {
//     const [selectedMonth, setSelectedMonth] = useState('July');
//     const [selectedYear, setSelectedYear] = useState('2023');
//     const [currentView, setCurrentView] = useState('July 2023');
//     const [selectedDate, setSelectedDate] = useState<number | null>(null);
//     const [showYearSelector, setShowYearSelector] = useState(false);
//     const [viewedYear, setViewedYear] = useState(2023);
//     const [viewedMonth, setViewedMonth] = useState(6);
//     const calendarRef = useRef<HTMLDivElement | null>(null);



//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
//                 onClose(); // Close calendar if clicked outside
//             }
//         };

//         if (isOpen) {
//             document.addEventListener("mousedown", handleClickOutside);
//         }

//         return () => {
//             document.removeEventListener("mousedown", handleClickOutside);
//         };
//     }, [isOpen, onClose]);

//     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


//     const getMonthDetails = () => {
//         const firstDay = new Date(`${selectedMonth} 1, ${selectedYear}`).getDay();
//         const daysInMonth = new Date(parseInt(selectedYear), months.indexOf(selectedMonth) + 1, 0).getDate();
//         return { firstDay, daysInMonth };
//     };

//     const { firstDay, daysInMonth } = getMonthDetails();

//     const generateCalendarDays = () => {
//         const days = [];
//         const { firstDay, daysInMonth } = getMonthDetails();

//         for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
//             days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
//         }

//         for (let day = 1; day <= daysInMonth; day++) {
//             const currentDay = day;
//             days.push(
//                 <button
//                     key={`day-${day}`}
//                     onClick={() => {
//                         setSelectedDate(currentDay);
//                         onSelect(`${selectedMonth} ${currentDay}, ${selectedYear}`);
//                     }}
//                     className={`text-sm p-2 rounded-full text-center
//         hover:bg-blue-50 
//         ${selectedDate === currentDay ? 'bg-blue-100 text-blue-600' : ''}`}
//                 >
//                     {day}
//                 </button>
//             );
//         }
//         return days;
//     };

//     const handleMonthChange = (direction: 'prev' | 'next') => {
//         const currentMonthIndex = months.indexOf(selectedMonth);
//         let newMonth: string;
//         let newYear = parseInt(selectedYear);

//         if (direction === 'next') {
//             if (currentMonthIndex === 11) {
//                 newMonth = months[0];
//                 newYear += 1;
//             } else {
//                 newMonth = months[currentMonthIndex + 1];
//             }
//         } else {
//             if (currentMonthIndex === 0) {
//                 newMonth = months[11];
//                 newYear -= 1;
//             } else {
//                 newMonth = months[currentMonthIndex - 1];
//             }
//         }

//         setSelectedMonth(newMonth);
//         setSelectedYear(newYear.toString());
//         setCurrentView(`${newMonth} ${newYear}`);
//         setSelectedDate(null);
//     };

//     const handleYearChange = (direction: 'prev' | 'next') => {
//         let newYear = viewedYear;
//         if (direction === 'next') {
//             newYear += 1;
//         } else {
//             newYear -= 1;
//         }
//         setViewedYear(newYear);
//     };
//     const handleMonthNavigation = (direction: 'prev' | 'next') => {
//         let newMonth = viewedMonth;
//         if (direction === 'next') {
//             newMonth = (newMonth + 1) % 12;
//         } else {
//             newMonth = (newMonth - 1 + 12) % 12;
//         }
//         setViewedMonth(newMonth);
//     };

//     const handleMonthYearSelect = (month?: string, year?: string) => {
//         if (month) setSelectedMonth(month);
//         if (year) setSelectedYear(year);
//         setCurrentView(`${month || selectedMonth} ${year || selectedYear}`);

//     };

//     if (!isOpen) return null;

//     return (
//         <div
//         ref={calendarRef}
//          className="flex">

//             <div
//                 className={`absolute top-full right-0 bg-white rounded-xl shadow-lg border border-gray-200 w-[320px] p-4 z-50 ${isOpen ? "block" : "hidden"
//                     }`}>

//                 <div className="mb-4">
//                     <div className="flex justify-between items-center mb-4">
//                         <button
//                             onClick={() => setShowYearSelector(!showYearSelector)}
//                             className="text-gray-800 hover:text-gray-800 flex items-center gap-1 font-semibold"
//                         >
//                             {currentView} <ChevronDown className="h-4 w-4 text-primary" />
//                         </button>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => handleMonthChange('prev')}
//                                 className="p-1 hover:bg-gray-100 rounded"
//                             >
//                                 <ChevronLeft className="h-4 w-4 text-primary" />
//                             </button>
//                             <button
//                                 onClick={() => handleMonthChange('next')}
//                                 className="p-1 hover:bg-gray-100 rounded text-primary"
//                             >
//                                 <ChevronRight className="h-4 w-4" />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-7 gap-1">
//                         {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
//                             <div key={day} className="text-xs text-gray-500 text-center py-1">
//                                 {day}
//                             </div>
//                         ))}
//                         {generateCalendarDays()}
//                     </div>
//                 </div>


//             </div>

//             {showYearSelector && (
//                 <div
//                 className={`absolute top-full right-80 bg-white rounded-xl shadow-lg border border-gray-200 w-[320px] p-4 mr-4 z-50`}
//               >              

//                     <div className="mb-4">
//                         <button
//                             className="text-gray-800 hover:text-gray-800 flex items-center gap-1 font-semibold mb-4"
//                         >
//                             {currentView} <ChevronUp className="h-4 w-4 text-primary" />
//                         </button>
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className='text-sm text-gray-800 text-semibold'>Month</h3>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => handleMonthNavigation('prev')}
//                                     className="p-1 hover:bg-gray-100 rounded"
//                                 >
//                                     <ChevronLeft className="h-4 w-4 text-primary" />
//                                 </button>
//                                 <button
//                                     onClick={() => handleMonthNavigation('next')}
//                                     className="p-1 hover:bg-gray-100 rounded"
//                                 >
//                                     <ChevronRight className="h-4 w-4 text-primary" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {Array.from({ length: 4 }, (_, i) => (viewedMonth - 1 + i + 12) % 12).map(monthIndex => (
//                                 <button
//                                     key={monthIndex}
//                                     onClick={() => handleMonthYearSelect(months[monthIndex])}
//                                     className={`p-2 text-xs rounded-lg
//                                         ${months[monthIndex] === selectedMonth ? 'bg-blue-100 text-blue-600 border border-blue-300' : 'hover:bg-gray-50 bg-gray-100 border border-gray-200'}`}
//                                 >
//                                     {months[monthIndex]}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className='text-sm text-gray-800 text-semibold'>Year</h3>
//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => handleYearChange('prev')}
//                                     className="p-1 hover:bg-gray-100 rounded"
//                                 >
//                                     <ChevronLeft className="h-4 w-4 text-primary" />
//                                 </button>
//                                 <button
//                                     onClick={() => handleYearChange('next')}
//                                     className="p-1 hover:bg-gray-100 rounded"
//                                 >
//                                     <ChevronRight className="h-4 w-4 text-primary" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-4 gap-2">
//                             {Array.from({ length: 4 }, (_, i) => viewedYear + i).map(year => (
//                                 <button
//                                     key={year}
//                                     onClick={() => handleMonthYearSelect(undefined, year.toString())}
//                                     className={`p-2 text-xs rounded-lg 
//                     ${year.toString() === selectedYear ? 'bg-blue-200 text-blue-600 border border-blue-300' : 'hover:bg-gray-50 bg-gray-200 border border-gray-300'}`}
//                                 >
//                                     {year}
//                                 </button>
//                             ))}
//                         </div>
//                         <div className="flex justify-between mt-4 gap-2">
//                             <button
//                                 onClick={onClose}
//                                 className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 flex-1"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => {
//                                     setShowYearSelector(false); // Close the modal only when "Done" is clicked
//                                 }}
//                                 className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-700 flex-1"
//                             >
//                                 Done
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default CalendarFilter;



'use client';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: string, startDate?: Date, endDate?: Date) => void;
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
    
    // Date range states
    const [isRangeMode, setIsRangeMode] = useState(false);
    const [rangeStartDate, setRangeStartDate] = useState<Date | null>(null);
    const [rangeEndDate, setRangeEndDate] = useState<Date | null>(null);
    const [tempDate, setTempDate] = useState<Date | null>(null);
    const [rangeType, setRangeType] = useState<string | null>(null);

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

    const isDateInRange = (day: number) => {
        if (!rangeStartDate || !tempDate) return false;
        
        const currentDate = new Date(parseInt(selectedYear), months.indexOf(selectedMonth), day);
        const start = new Date(rangeStartDate);
        const end = new Date(tempDate);
        
        return currentDate >= start && currentDate <= end;
    };

    const generateCalendarDays = () => {
        const days = [];
        const { firstDay, daysInMonth } = getMonthDetails();

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = day;
            const currentDate = new Date(parseInt(selectedYear), months.indexOf(selectedMonth), day);
            
            const isStart = rangeStartDate && 
                currentDate.getDate() === rangeStartDate.getDate() && 
                currentDate.getMonth() === rangeStartDate.getMonth() && 
                currentDate.getFullYear() === rangeStartDate.getFullYear();
                
            const isEnd = rangeEndDate && 
                currentDate.getDate() === rangeEndDate.getDate() && 
                currentDate.getMonth() === rangeEndDate.getMonth() && 
                currentDate.getFullYear() === rangeEndDate.getFullYear();
            
            const isRangeDay = isDateInRange(day);
            
            days.push(
                <button
                    key={`day-${day}`}
                    onClick={() => handleDateClick(currentDay, currentDate)}
                    className={`text-sm p-2 rounded-full text-center
                        hover:bg-blue-50 
                        ${isRangeMode && isStart ? 'bg-blue-600 text-white' : ''}
                        ${isRangeMode && isEnd ? 'bg-blue-600 text-white' : ''}
                        ${isRangeMode && isRangeDay && !isStart && !isEnd ? 'bg-blue-100 text-blue-600' : ''}
                        ${!isRangeMode && selectedDate === currentDay ? 'bg-blue-600 text-white' : ''}`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const handleDateClick = (day: number, date: Date) => {
        if (isRangeMode) {
            if (!rangeStartDate) {
                setRangeStartDate(date);
                setTempDate(date);
            } else {
                // If the clicked date is before start date, swap them
                if (date < rangeStartDate) {
                    setRangeEndDate(rangeStartDate);
                    setRangeStartDate(date);
                } else {
                    setRangeEndDate(date);
                }
                
                // Format the date range for display
                const startDateStr = rangeStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                const endDateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                const rangeStr = `${startDateStr} - ${endDateStr}`;
                
                // Send both the formatted string and the actual date objects
                onSelect(rangeStr, rangeStartDate, date);
                
                // Reset for next selection
                setRangeStartDate(null);
                setRangeEndDate(null);
                setTempDate(null);
            }
        } else {
            setSelectedDate(day);
            const dateStr = `${selectedMonth} ${day}, ${selectedYear}`;
            const selectedDate = new Date(parseInt(selectedYear), months.indexOf(selectedMonth), day);
            onSelect(dateStr, selectedDate, selectedDate);
        }
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

    // Predefined date range handlers
    const handlePredefinedRange = (rangeName: string) => {
        const today = new Date();
        let startDate: Date = new Date();
        let endDate: Date = new Date();
        
        switch (rangeName) {
            case "Today":
                // Both start and end dates are today
                break;
                
            case "This Week":
                // Start date is today, end date is end of week (Sunday)
                const dayOfWeek = today.getDay();
                endDate.setDate(today.getDate() + (6 - dayOfWeek));
                break;
                
            case "This Month":
                // Start date is today, end date is end of month
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
                
            case "Next 30 Days":
                // Start date is today, end date is 30 days from today
                endDate.setDate(today.getDate() + 29); // +29 because today is included
                break;
                
            case "Next 60 Days":
                // Start date is today, end date is 60 days from today
                endDate.setDate(today.getDate() + 59);
                break;
                
            case "Next 90 Days":
                // Start date is today, end date is 90 days from today
                endDate.setDate(today.getDate() + 89);
                break;
        }
        
        // Format for display and send both text and date objects
        const startDateStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const endDateStr = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        // If start and end are the same, just return one date
        const rangeStr = startDate.getTime() === endDate.getTime() 
            ? startDateStr 
            : `${startDateStr} - ${endDateStr}`;
            
        setRangeType(rangeName);
        onSelect(rangeName, startDate, endDate);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div ref={calendarRef} className="flex">
            <div className={`absolute top-full right-0 bg-white rounded-xl shadow-lg border border-gray-200 w-[320px] p-4 z-50 ${isOpen ? "block" : "hidden"}`}>
                {/* Mode Toggle */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <button 
                        onClick={() => setIsRangeMode(false)}
                        className={`text-sm px-3 py-1 rounded ${!isRangeMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                        Single Date
                    </button>
                    <button 
                        onClick={() => setIsRangeMode(true)}
                        className={`text-sm px-3 py-1 rounded ${isRangeMode ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                    >
                        Date Range
                    </button>
                </div>
                
                {/* Quick Date Range Options (only show when in range mode) */}
                {isRangeMode && (
                    <div className="mb-4 border-b pb-2">
                        <div className="text-sm text-gray-600 mb-2">Quick Select:</div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handlePredefinedRange("Today")} className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Today</button>
                            <button onClick={() => handlePredefinedRange("This Week")} className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">This Week</button>
                            <button onClick={() => handlePredefinedRange("This Month")} className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">This Month</button>
                            <button onClick={() => handlePredefinedRange("Next 30 Days")} className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Next 30 Days</button>
                            <button onClick={() => handlePredefinedRange("Next 60 Days")} className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Next 60 Days</button>
                            <button onClick={() => handlePredefinedRange("Next 90 Days")} className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded">Next 90 Days</button>
                        </div>
                    </div>
                )}

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

                {isRangeMode && rangeStartDate && !rangeEndDate && (
                    <div className="text-sm text-gray-600 mb-2 italic">
                        Please select end date
                    </div>
                )}
            </div>

            {showYearSelector && (
                <div className={`absolute top-full right-80 bg-white rounded-xl shadow-lg border border-gray-200 w-[320px] p-4 mr-4 z-50`}>
                    <div className="mb-4">
                        <button className="text-gray-800 hover:text-gray-800 flex items-center gap-1 font-semibold mb-4">
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