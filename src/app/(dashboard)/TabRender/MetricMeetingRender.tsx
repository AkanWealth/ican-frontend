"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, Video, Mic, Files, Calendar } from "lucide-react";

function MetricMeetingRender() {
  // Sample activity data (you would replace this with your actual data)
  const [activities, setActivities] = useState([
    { id: 1, month: "January", status: "present" },
    { id: 2, month: "February", status: "present" },
    { id: 3, month: "March", status: "present" },
    { id: 4, month: "April", status: "absent" }
  ]);

  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("jan-jul");
  const [timeFilter, setTimeFilter] = useState("This month");
  const [isTimeFilterOpen, setIsTimeFilterOpen] = useState(false);
  
  const [metrics, setMetrics] = useState({
    totalMeetings: 4,
    numberRegistered: 4,
    numberAttended: 3
  });

  // Monthly attendance data for the bar chart
  const [monthlyData, setMonthlyData] = useState([
    { month: "Jan", registered: 100, attended: 90, notAttended: 10 },
    { month: "Feb", registered: 100, attended: 40, notAttended: 60 },
    { month: "Mar", registered: 100, attended: 65, notAttended: 35 },
    { month: "Apr", registered: 100, attended: 25, notAttended: 75 },
    { month: "May", registered: 100, attended: 80, notAttended: 20 },
    { month: "Jun", registered: 100, attended: 45, notAttended: 55 },
    { month: "Jul", registered: 100, attended: 80, notAttended: 20 }
  ]);

  // Data for the donut chart
  const [attendanceData, setAttendanceData] = useState({
    registered: 100,
    attended: 70,
    notAttended: 30
  });

  const months = [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const shortMonths = {
    "January": "Jan",
    "February": "Feb",
    "March": "Mar",
    "April": "Apr",
    "May": "May",
    "June": "Jun",
    "July": "Jul",
    "August": "Aug",
    "September": "Sep",
    "October": "Oct",
    "November": "Nov",
    "December": "Dec"
  };

  const dateRanges = [
    "jan-jul",
    "aug-dec",
    "jan-dec"
  ];

  const timeFilters = [
    "This month",
    "Last month",
    "Last 3 months",
    "Last 6 months",
    "This year"
  ];

 
  

  const updateMetrics = useCallback((filteredActivities: { id: number; month: string; status: string; }[]) => {
    const totalMeetings = filteredActivities.length;
    const numberAttended = filteredActivities.filter(activity => activity.status === "present").length;
    
    setMetrics({
      totalMeetings,
      numberRegistered: totalMeetings, // Assuming all meetings are registered
      numberAttended
    });
  }, []);

  const filterActivitiesByMonth = useCallback((month: string) => {
    let filtered = activities;
    if (month !== "All") {
      filtered = activities.filter(activity => activity.month === month);
    }
    setFilteredActivities(filtered);
    updateMetrics(filtered);
  }, [activities, updateMetrics]);


  useEffect(() => {
    filterActivitiesByMonth(selectedMonth);
  }, [selectedMonth, filterActivitiesByMonth]);


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDateRange = () => {
    setIsDateRangeOpen(!isDateRangeOpen);
  };

  const toggleTimeFilter = () => {
    setIsTimeFilterOpen(!isTimeFilterOpen);
  };

  const handleMonthSelect = (month: React.SetStateAction<string>) => {
    setSelectedMonth(month);
    setIsDropdownOpen(false);
  };

  const handleDateRangeSelect = (range: React.SetStateAction<string>) => {
    setSelectedDateRange(range);
    setIsDateRangeOpen(false);
  };

  const handleTimeFilterSelect = (filter: React.SetStateAction<string>) => {
    setTimeFilter(filter);
    setIsTimeFilterOpen(false);
  };

  // Function to render the bar chart
  const renderBarChart = () => {
    const maxBarHeight = 100; // Maximum height for the bars
    
    return (
      <div className="flex items-end h-48 mt-4 space-x-6 mb-2">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="relative w-8 bg-blue-100 rounded-t-sm" style={{ height: `${maxBarHeight}px` }}>
              <div 
                className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm"
                style={{ height: `${data.attended}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-500">{data.month}</div>
          </div>
        ))}
      </div>
    );
  };

  // Function to render the donut chart
  const renderDonutChart = () => {
    // Calculate stroke dash arrays for the donut segments
    const circumference = 2 * Math.PI * 50; // 50 is the radius
    const attendedDash = (attendanceData.attended / 100) * circumference;
    const notAttendedDash = (attendanceData.notAttended / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <svg width="160" height="160" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="transparent" stroke="#E5E7EB" strokeWidth="12" />
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="transparent" 
            stroke="#FCD34D" 
            strokeWidth="12"
            strokeDasharray={`${notAttendedDash} ${circumference - notAttendedDash}`}
            strokeDashoffset="0"
            transform="rotate(-90 60 60)"
          />
          <circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="transparent" 
            stroke="#3B82F6" 
            strokeWidth="12"
            strokeDasharray={`${attendedDash} ${circumference - attendedDash}`}
            strokeDashoffset={`-${notAttendedDash}`}
            transform="rotate(-90 60 60)"
          />
        </svg>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Metrics Card */}
            <div className="w-full bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="mb-2 text-lg font-semibold">Metric</h3>
              
              {/* Month dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-between w-40 px-3 py-2 border border-gray-400 rounded-lg hover:bg-gray-50"
                >
                  <span className={`${selectedMonth === "All" ? "text-gray-400" : "text-gray-700"}`}>
                    {selectedMonth}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-40 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      {months.map((month) => (
                        <li 
                          key={month}
                          onClick={() => handleMonthSelect(month)}
                          className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {month}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="items-center justify-between">
                <div className="lg:w-3/4 md:w-full grid lg:grid-cols-3 md:grid-row rounded-lg gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-8 h-8 p-2 rounded-lg item-center justify-center mr-2">
                        <Video className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Total Meetings held</p>
                    </div>
                    <p className="font-bold text-3xl">{metrics.totalMeetings}</p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-8 h-8 p-2 rounded-lg item-center justify-center mr-2">
                        <Files className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Number registered</p>
                    </div>
                    <p className="font-bold text-3xl">{metrics.numberRegistered}</p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-8 h-8 p-2 rounded-lg item-center justify-center mr-2">
                        <Mic className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Number Attended</p>
                    </div>
                    <p className="font-bold text-3xl">{metrics.numberAttended}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Card with Charts */}
            <div className="w-full bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Summary</h3>
                
                {/* Date range dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDateRange}
                    className="flex items-center justify-between px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  >
                    <span className="text-sm font-medium">{selectedDateRange}</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  
                  {isDateRangeOpen && (
                    <div className="absolute z-10 w-32 mt-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg">
                      <ul className="py-1">
                        {dateRanges.map((range) => (
                          <li 
                            key={range}
                            onClick={() => handleDateRangeSelect(range)}
                            className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {range}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left side - Bar Chart */}
                <div className="lg:col-span-2 border-r border-gray-200 pr-6">
                  {renderBarChart()}
                </div>
                
                {/* Right side - Donut Chart */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium">Meetings</h4>
                    
                    {/* Time filter dropdown */}
                    <div className="relative">
                      <button
                        onClick={toggleTimeFilter}
                        className="flex items-center justify-between text-sm text-gray-500"
                      >
                        <span>{timeFilter}</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                      
                      {isTimeFilterOpen && (
                        <div className="absolute z-10 w-36 mt-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg">
                          <ul className="py-1">
                            {timeFilters.map((filter) => (
                              <li 
                                key={filter}
                                onClick={() => handleTimeFilterSelect(filter)}
                                className="px-3 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                              >
                                {filter}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {renderDonutChart()}
                  
                  {/* Chart Legend */}
                  <div className="mt-4 flex flex-col space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Registered</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                      <span className="text-sm text-gray-600">Did not attend</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <span className="text-sm text-gray-600">Attended</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricMeetingRender;