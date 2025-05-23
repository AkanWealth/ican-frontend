"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, Video, Mic, Files, Calendar } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import apiClient from "@/services/apiClient";
import { parseCookies } from "nookies";





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


  interface GraphSummaryItem {
    date: string;
    totalRegistrations: number;
    attended: number;
  }

  const [graphSummaryData, setGraphSummaryData] = useState<GraphSummaryItem[]>([]);
  const [isLoadingGraphData, setIsLoadingGraphData] = useState(true);
  // Added from AttendanceRender
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [apiMeetingsData, setApiMeetingsData] = useState<any[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [userAttendance, setUserAttendance] = useState<any[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  
  // Metrics state from AttendanceRender
  const [metrics, setMetrics] = useState({
    totalMeetings: 0,
    numberRegistered: 0,
    numberAttended: 0
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
  const [attendanceData, setAttendanceData] = useState<{
    registered: number;
    attended: number;
    notAttended: number;
    rawRegistered?: number;
    rawAttended?: number;
    rawNotAttended?: number;
  }>({
    registered: 100,
    attended: 70,
    notAttended: 30
  });

  const months = useMemo(() => [
    "All", "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ], []);

  const shortMonths = useMemo(
    () => ({
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec",
    }),
    []
  );

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

  useEffect(() => {
    const fetchGraphSummaryData = async () => {
      setIsLoadingGraphData(true);
      try {
        const response = await apiClient.get('/meetings/graph-summary');
        console.log('Graph summary data:', response);
        setGraphSummaryData(response);
      } catch (err) {
        console.error('Error fetching graph summary data:', err);
      } finally {
        setIsLoadingGraphData(false);
      }
    };

    fetchGraphSummaryData();
  }, []);

  // Fetch meetings data from API for metrics only (from AttendanceRender)
  useEffect(() => {
    const fetchMeetingsMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const response = await apiClient.get("/meetings");
        console.log("Meetings response", response);

        // Check if the response status is not 200 (OK)
        // if (response.status !== 200) {
        //   throw new Error(`API request failed with status ${response.status}`);
        // }
        
        const data = response;
        
        // Transform API data for metrics calculation
        const formattedMeetingsData = data.map((meeting: any) => {
          const meetingDate = new Date(meeting.date || new Date().toISOString());
          const currentDate = new Date();
          
          // Check if meeting date has passed
          const hasHeld = currentDate > meetingDate;
          
          // Format date to match the component's expected format
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const formattedDate = `${monthNames[meetingDate.getMonth()]} ${meetingDate.getDate()}, ${meetingDate.getFullYear()}`;
          
          return {
            MeetingTitle: meeting.title || "Monthly ICAN Meeting",
            date: formattedDate,
            status: meeting.attended ? "present" : "absent",
            hasHeld: hasHeld
          };
        });
        
        // Filter to only include meetings that have been held
        const heldMeetings = formattedMeetingsData.filter((meeting: any) => meeting.hasHeld);
        
        setApiMeetingsData(heldMeetings);
        // Update the metrics state with the total meetings count
        setMetrics(prev => ({
          ...prev,
          totalMeetings: heldMeetings.length
        }));
        setIsLoadingMetrics(false);
      } catch (err) {
        console.error("Error fetching meetings metrics:", err);
        setIsLoadingMetrics(false);
      }
    };

    fetchMeetingsMetrics();
  }, []);

  // Fetch user registrations for metrics only (from AttendanceRender)
  useEffect(() => {
     const fetchUserRegistrations = async () => {
          setIsLoadingRegistrations(true);
          try {
            // Get user info from local storage
            const cookies = parseCookies();
            const userInfo = cookies.user_data;
            if (!userInfo) {
              console.error("User info not found in localStorage");
              setIsLoadingRegistrations(false);
              return;
            }
            
            const parsedUserInfo = JSON.parse(userInfo);
            const userId = parsedUserInfo.id;
            
            if (!userId) {
              console.error("User ID not found in userInfo");
              setIsLoadingRegistrations(false);
              return;
            }
        
            console.log("Fetching for user ID:", userId);
        
            // Fetch registrations for the user
            const response = await apiClient.get(`/events/registrations/user-events/${userId}`);
            
            // Log the raw response to see its structure
            console.log("Raw API response:", response);
            
            // Handle different possible response formats
            let registrations = [];
            
            if (response && response.data) {
              // If response.data is an array
              if (Array.isArray(response.data)) {
                registrations = response.data;
              } 
              // If response.data is a single object with userId that matches
              else if (response.data.userId === userId) {
                registrations = [response.data];
              }
              // If response itself is the data (no .data property)
            } else if (Array.isArray(response)) {
              registrations = response;
            } else if (response && response.userId === userId) {
              registrations = [response];
            }
            
            console.log("Processed registrations:", registrations);
            console.log("Registration count:", registrations.length);
            
            // Filter to ensure all have the correct userId (extra safeguard)
            const validRegistrations = registrations.filter((reg: any) => 
              reg && reg.userId === userId
            );
            
            console.log("Valid registrations for this user:", validRegistrations);
            console.log("Valid registration count:", validRegistrations.length);
            
            setUserRegistrations(validRegistrations);
            
            // Update metrics
            setMetrics(prev => ({
              ...prev,
              numberRegistered: validRegistrations.length
            }));
            
            setIsLoadingRegistrations(false);
          } catch (err) {
            console.error("Error fetching user registrations:", err);
            console.error("Error details:", "No response data");
            setUserRegistrations([]);
            setMetrics(prev => ({
              ...prev,
              numberRegistered: 0
            }));
            setIsLoadingRegistrations(false);
          }
        };

    fetchUserRegistrations();
  }, []);

  // Fetch user attendance (from AttendanceRender)
  useEffect(() => {
    const fetchUserAttendance = async () => {
      setIsLoadingAttendance(true);
      try {
        // Get user ID from local storage
        const cookies = parseCookies();
        const userInfo = cookies.user_data;
        if (!userInfo) {
          console.error("User info not found");
          setIsLoadingAttendance(false);
          return;
        }
        
        const parsedUserInfo = JSON.parse(userInfo);
        const userId = parsedUserInfo.id;
        
        if (!userId) {
          console.error("User ID not found");
          setIsLoadingAttendance(false);
          return;
        }

        try {
          const attendanceResponse = await apiClient.get(`/events/registrations/attendance/${userId}`);
          console.log("User attendance:", attendanceResponse.data);
          
          // Check if the response is an array or a single object
          let attendanceData = Array.isArray(attendanceResponse.data)
            ? attendanceResponse.data
            : [attendanceResponse.data];
          
          setUserAttendance(attendanceData);
          
          // Get total number of attended meetings
          const totalAttended = attendanceData.filter((item: any) => item.status === "ATTENDED").length;
          
          // Update metrics with attendance count
          setMetrics(prev => ({
            ...prev,
            numberAttended: totalAttended
          }));
          
        } catch (error: any) {
          // If we get a 404, it means the user has no attendance records
          if (error.response && error.response.status === 404) {
            console.log("No attendance records found for this user");
            setUserAttendance([]);
            setMetrics(prev => ({
              ...prev,
              numberAttended: 0
            }));
          } else {
            // Re-throw for other errors
            throw error;
          }
        }
        
        setIsLoadingAttendance(false);
      } catch (err) {
        console.error("Error fetching user attendance:", err);
        setUserAttendance([]);
        setIsLoadingAttendance(false);
      }
    };

    fetchUserAttendance();
  }, []);

  // Effect to update ONLY metrics when selectedMonth changes (from AttendanceRender)
 // Modified useEffect with better dependency control
// Modified useEffect with all required dependencies
useEffect(() => {
  if (!isLoadingRegistrations && !isLoadingAttendance && !isLoadingMetrics) {
    let totalMeetings, numberRegistered, numberAttended;
    
    if (selectedMonth === "All") {
      totalMeetings = apiMeetingsData.length;
      numberRegistered = userRegistrations.length;
      numberAttended = userAttendance.filter((item) => item.status === "PRESENT").length;
    } else {
      const shortMonth = shortMonths[selectedMonth as keyof typeof shortMonths];
      
      const filteredMeetings = apiMeetingsData.filter((meeting) => {
        return meeting.date.startsWith(shortMonth);
      });
      
      const filteredRegistrations = userRegistrations.filter((reg) => {
        if (!reg.createdAt) return false;
        const regDate = new Date(reg.createdAt);
        return months[regDate.getMonth() + 1] === selectedMonth;
      });
      
      const filteredAttendance = userAttendance.filter((att) => {
        if (!att.createdAt) return false;
        const attDate = new Date(att.createdAt);
        return months[attDate.getMonth() + 1] === selectedMonth;
      });
      
      totalMeetings = filteredMeetings.length;
      numberRegistered = filteredRegistrations.length;
      numberAttended = filteredAttendance.filter((item) => item.status === "ATTENDED").length;
    }
    
    // Only update if values have changed
    if (metrics.totalMeetings !== totalMeetings || 
        metrics.numberRegistered !== numberRegistered || 
        metrics.numberAttended !== numberAttended) {
      setMetrics({
        totalMeetings,
        numberRegistered,
        numberAttended
      });
    }
  }
}, [
  selectedMonth, 
  isLoadingRegistrations, 
  isLoadingAttendance, 
  isLoadingMetrics, 
  apiMeetingsData, 
  userRegistrations, 
  userAttendance,
  metrics.totalMeetings,
  metrics.numberRegistered,
  metrics.numberAttended,
  months,
  shortMonths
]);
const processBarChartData = useCallback(() => {
  if (!graphSummaryData || graphSummaryData.length === 0) {
    return monthlyData; // Return default data if API data is not available
  }

  // Group data by month
  const groupedByMonth = graphSummaryData.reduce((acc: Record<string, { registered: number; attended: number }>, item) => {
    const date = new Date(item.date);
    const month = date.getMonth(); // 0-11
    const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month];
    
    if (!acc[monthName]) {
      acc[monthName] = {
        registered: 0,
        attended: 0
      };
    }
    
    acc[monthName].registered += item.totalRegistrations;
    acc[monthName].attended += item.attended;
    
    return acc;
  }, {});
  
  // Convert to array format expected by the chart
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Filter months based on selected date range
  let filteredMonths = [...monthNames];
  if (selectedDateRange === "jan-jul") {
    filteredMonths = monthNames.slice(0, 7); // Jan to Jul
  } else if (selectedDateRange === "aug-dec") {
    filteredMonths = monthNames.slice(7); // Aug to Dec
  }
  
  return filteredMonths.map(month => {
    const monthData = groupedByMonth[month] || { registered: 0, attended: 0 };
    const notAttended = Math.max(0, monthData.registered - monthData.attended);
    
    // Calculate percentages for visualization
    // If registered is 0, use defaults to avoid division by zero
    let attendedPercentage = 0;
    let notAttendedPercentage = 0;
    
    if (monthData.registered > 0) {
      attendedPercentage = Math.round((monthData.attended / monthData.registered) * 100);
      notAttendedPercentage = 100 - attendedPercentage;
    }
    
    return {
      month,
      registered: monthData.registered,
      attended: attendedPercentage,
      notAttended: notAttendedPercentage,
      // Keep the raw counts for tooltips or other displays
      rawAttended: monthData.attended,
      rawNotAttended: notAttended
    };
  });
}, [graphSummaryData, selectedDateRange, monthlyData]);

// NEW: Update donut chart data based on API data and time filter
useEffect(() => {
  if (graphSummaryData && graphSummaryData.length > 0) {
    // Apply time filter if selected
    let filteredData = [...graphSummaryData];
    const currentDate = new Date();
    
    if (timeFilter === "This month") {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      filteredData = graphSummaryData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      });
    } else if (timeFilter === "Last month") {
      const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const year = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      filteredData = graphSummaryData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getMonth() === lastMonth && itemDate.getFullYear() === year;
      });
    } else if (timeFilter === "Last 3 months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      filteredData = graphSummaryData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= threeMonthsAgo;
      });
    } else if (timeFilter === "Last 6 months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
      filteredData = graphSummaryData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= sixMonthsAgo;
      });
    } else if (timeFilter === "This year") {
      const currentYear = currentDate.getFullYear();
      filteredData = graphSummaryData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === currentYear;
      });
    }
    
    // Calculate totals for filtered data
    const filteredTotalRegistered = filteredData.reduce((sum, item) => sum + item.totalRegistrations, 0);
    const filteredTotalAttended = filteredData.reduce((sum, item) => sum + item.attended, 0);
    
    if (filteredTotalRegistered > 0) {
      const attendedPercentage = Math.round((filteredTotalAttended / filteredTotalRegistered) * 100);
      const notAttendedPercentage = 100 - attendedPercentage;
      
      setAttendanceData({
        registered: 100, // Always 100% for the full circle
        attended: attendedPercentage,
        notAttended: notAttendedPercentage,
        // Keep raw numbers for tooltips or labels
        rawRegistered: filteredTotalRegistered,
        rawAttended: filteredTotalAttended,
        rawNotAttended: filteredTotalRegistered - filteredTotalAttended
      });
    } else {
      // Default values when no registrations
      setAttendanceData({
        registered: 100,
        attended: 0,
        notAttended: 0,
        rawRegistered: 0,
        rawAttended: 0,
        rawNotAttended: 0
      });
    }
  }
}, [graphSummaryData, timeFilter])

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
    const chartData = processBarChartData();
    
    return (
      <div className="flex items-end h-48 mt-4 space-x-6 mb-2">
        {isLoadingGraphData ? (
          <div className="flex items-center justify-center w-full">
            <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          chartData.map((data, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-8 bg-blue-100 rounded-t-sm" style={{ height: `${maxBarHeight}px` }}>
                <div 
                  className="absolute bottom-0 w-full bg-blue-600 rounded-t-sm"
                  style={{ height: `${data.attended}%` }}
                  title={`Attended: ${data.attended} (${data.attended}%)`}
                ></div>
              </div>
              <div className="mt-2 text-xs text-gray-500">{data.month}</div>
              <div className="mt-1 text-xs text-blue-600">{data.registered}</div>
            </div>
          ))
        )}
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
    <div className="min-h-screen">
      <div className="">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Metrics Card */}
            {/* <div className="w-full bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="mb-2 text-lg font-semibold">Metric</h3>
              
              // Month dropdown 
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
                <div className="w-full grid lg:grid-cols-3 md:grid-row rounded-lg gap-4">
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-8 h-8 p-2 rounded-lg item-center justify-center mr-2">
                        <Video className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Total Meetings held</p>
                    </div>
                    {isLoadingMetrics ? (
                      <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <p className="font-bold text-3xl">{metrics.totalMeetings}</p>
                    )}
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-8 h-8 p-2 rounded-lg item-center justify-center mr-2">
                        <Files className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Number of Registrations</p>
                    </div>
                    {isLoadingRegistrations ? (
                      <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <p className="font-bold text-3xl">{metrics.numberRegistered}</p>
                    )}
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-8 h-8 p-2 rounded-lg item-center justify-center mr-2">
                        <Mic className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Number of Attendees</p>
                    </div>
                    {isLoadingAttendance ? (
                      <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <p className="font-bold text-3xl">{metrics.numberAttended}</p>
                    )}
                  </div>
                </div>
              </div>
            </div> */}

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