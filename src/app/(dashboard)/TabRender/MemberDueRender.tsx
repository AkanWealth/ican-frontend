"use client";

import React, { useState, useEffect, useMemo } from "react";
import TablePagination from "@/components/Pagenation";
import {
  Search,
  ListFilter,
  ChevronDown,
  XCircle,
  CheckCircle,
  Video,
  Mic,
  Files,
  EllipsisVertical,
} from "lucide-react";
import CalendarFilter from "@/components/homecomps/CalendarFilter";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { Checkbox } from "@mui/material";


function MemberDueRender() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [apiMeetingsData, setApiMeetingsData] = useState<any[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [userAttendance, setUserAttendance] = useState<any[]>([]);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(true);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [originalAttendanceRecords, setOriginalAttendanceRecords] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    totalMeetings: 0,
    numberRegistered: 0,
    numberAttended: 0,
  });

  // const BASE_API_URL = "https://ican-api-6000e8d06d3a.herokuapp.com/api";
  const itemsPerPage = 4;

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

  // Fetch meetings data from API for metrics only
  useEffect(() => {
    const fetchMeetingsMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const response = await axios.get(
          "https://ican-api-6000e8d06d3a.herokuapp.com/api/meetings",{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log("Meetings response", response);

        // Check if the response status is not 200 (OK)
        if (response.status !== 200) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = response.data;
        
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

  // Fetch user registrations for metrics only
  useEffect(() => {
    const fetchUserRegistrations = async () => {
      setIsLoadingRegistrations(true);
      try {
        // Get user info from local storage
        const userInfo = localStorage.getItem('user');
        if (!userInfo) {
          console.error("User info not found in localStorage");
          setIsLoadingRegistrations(false);
          return;
        }
        
        const parsedUserInfo = JSON.parse(userInfo);
        const email = parsedUserInfo.email;
        
        if (!email) {
          console.error("User email not found in userInfo");
          setIsLoadingRegistrations(false);
          return;
        }

        const registrationsResponse = await axios.get(
          `${BASE_API_URL}/events/registrations/user/${email}`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log("User registrations:", registrationsResponse.data);
        
        // Check if the response is an array or a single object
        let registrations = Array.isArray(registrationsResponse.data) 
          ? registrationsResponse.data 
          : [registrationsResponse.data];
        
        setUserRegistrations(registrations);
        
        // Get total number of registrations
        const totalRegistrations = registrations.length;
        
        // Update metrics with registration count
        setMetrics(prev => ({
          ...prev,
          numberRegistered: totalRegistrations
        }));
        
        setIsLoadingRegistrations(false);
      } catch (err) {
        console.error("Error fetching user registrations:", err);
        setUserRegistrations([]);
        setIsLoadingRegistrations(false);
      }
    };

    fetchUserRegistrations();
  }, []);

  // Fetch user attendance - This will populate the table and metrics
  useEffect(() => {
    const fetchUserAttendance = async () => {
      setIsLoadingAttendance(true);
      try {
        // Get user ID from local storage
        const userInfo = localStorage.getItem('user');
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
          const attendanceResponse = await axios.get(
            `${BASE_API_URL}/events/registrations/attendance/${userId}`, 
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
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
          
          // Format attendance data for table display
          const formattedAttendance = attendanceData.map((att: any) => {
            const attDate = new Date(att.createdAt || new Date().toISOString());
            
            // Format date to match the component's expected format
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const formattedDate = `${monthNames[attDate.getMonth()]} ${attDate.getDate()}, ${attDate.getFullYear()}`;
            
            return {
              MeetingTitle: att.eventTitle || "ICAN Meeting",
              date: formattedDate,
              status: att.status === "ATTENDED" ? "present" : "absent",
              id: att.id
            };
          });
          
          // Set both original and current attendance records
          setOriginalAttendanceRecords(formattedAttendance);
          setAttendanceRecords(formattedAttendance);
          
        } catch (error: any) {
          // If we get a 404, it means the user has no attendance records
          if (error.response && error.response.status === 404) {
            console.log("No attendance records found for this user");
            setUserAttendance([]);
            setOriginalAttendanceRecords([]);
            setAttendanceRecords([]);
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
        setOriginalAttendanceRecords([]);
        setAttendanceRecords([]);
        setIsLoadingAttendance(false);
      }
    };

    fetchUserAttendance();
  }, []);

  // Effect to update ONLY metrics when selectedMonth changes
  useEffect(() => {
    if (!isLoadingRegistrations && !isLoadingAttendance && !isLoadingMetrics) {
      if (selectedMonth === "All") {
        // Update metrics with all data
        const totalRegistrations = userRegistrations.length;
        const totalAttended = userAttendance.filter((item: any) => item.status === "ATTENDED").length;
        const totalMeetings = apiMeetingsData.length;
        
        setMetrics({
          totalMeetings: totalMeetings,
          numberRegistered: totalRegistrations,
          numberAttended: totalAttended
        });
      } else {
        // Filter meetings data by month for metrics ONLY
        const shortMonth = shortMonths[selectedMonth as keyof typeof shortMonths];
        
        const filteredMeetings = apiMeetingsData.filter((meeting) => {
          return meeting.date.startsWith(shortMonth);
        });
        
        // Filter registrations by month for metrics
        const filteredRegistrations = userRegistrations.filter((reg: any) => {
          if (!reg.createdAt) return false;
          const regDate = new Date(reg.createdAt);
          return months[regDate.getMonth() + 1] === selectedMonth;
        });
        
        // Filter attendance by month for metrics
        const filteredAttendance = userAttendance.filter((att: any) => {
          if (!att.createdAt) return false;
          const attDate = new Date(att.createdAt);
          return months[attDate.getMonth() + 1] === selectedMonth;
        });
        
        // Update metrics with filtered counts
        setMetrics({
          totalMeetings: filteredMeetings.length,
          numberRegistered: filteredRegistrations.length,
          numberAttended: filteredAttendance.filter((item: any) => item.status === "ATTENDED").length
        });
      }
      
      // NOTE: We do NOT update the attendance records table here
      // The table should always show all records regardless of month filter
    }
  }, [selectedMonth, isLoadingRegistrations, isLoadingAttendance, isLoadingMetrics, userRegistrations, userAttendance, apiMeetingsData,months, shortMonths]);

  const resetFilters = () => {
    setSelectedDate(null);
    setSelectedMonth("All");
    setAttendanceRecords([...originalAttendanceRecords]);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);

    const selectedDateObj = new Date(date);

    if (originalAttendanceRecords.length > 0) {
      const filteredAttendance = originalAttendanceRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          recordDate.getDate() === selectedDateObj.getDate() &&
          recordDate.getMonth() === selectedDateObj.getMonth() &&
          recordDate.getFullYear() === selectedDateObj.getFullYear()
        );
      });

      setAttendanceRecords(filteredAttendance);
    }
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
    // Do NOT filter table data here - only metrics will be affected
  };

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  // Filter attendance records based on search query
  const filteredAttendanceRecords = attendanceRecords.filter(
    (record) =>
      record.MeetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAttendanceRecords.length / itemsPerPage);

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAttendanceRecords.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderStatusBadge = (status: string) => {
    if (status === "absent") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
            <XCircle className="mr-1 h-3 w-3 rounded-full " />
            Absent
          </span>
        </div>
      );
    } else if (status === "present") {
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3 rounded-full" />
            Present
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="w-full h-30 bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="mb-2 text-lg font-semibold">Metric</h3>

              {/* Month dropdown button */}
              <div className="relative inline-block">
                <button
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  className="flex items-center px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-50 mb-4"
                >
                  <span
                    className={
                      selectedMonth === "All"
                        ? "text-gray-400"
                        : "text-gray-700"
                    }
                  >
                    {selectedMonth}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                </button>

                {/* Month dropdown menu */}
                {isMonthDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {months.map((month) => (
                        <li key={month}>
                          <button
                            onClick={() => handleMonthSelect(month)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              selectedMonth === month
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            {month}
                          </button>
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
                      <div className="flex bg-green-300 w-[2rem] h-[2rem] p-2 rounded-lg item-center justify-center mr-2">
                        <Video className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">
                        Total Meetings held
                      </p>
                    </div>
                    {isLoadingMetrics ? (
                      <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <p className="font-bold text-3xl">
                        {metrics.totalMeetings}
                      </p>
                    )}
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-[2rem] h-[2rem] p-2 rounded-lg item-center justify-center mr-2">
                        <Files className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">
                        Number registered
                      </p>
                    </div>
                    {isLoadingRegistrations ? (
                      <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <p className="font-bold text-3xl">
                        {metrics.numberRegistered}
                      </p>
                    )}
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-[2rem] h-[2rem] p-2 rounded-lg item-center justify-center mr-2">
                        <Mic className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Number Attended</p>
                    </div>
                    {isLoadingAttendance ? (
                      <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                      <p className="font-bold text-3xl">
                        {metrics.numberAttended}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white w-full flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
            <h1 className="font-semibold lg:text-lg md:text-base mb-6">
              Your attendance records
            </h1>
            <div className="flex lg:flex-row md:flex-col items-center justify-between w-full gap-4">
              <div className="flex w-full lg:w-2/3">
                <div className="relative group w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title, tag, or category..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full h-10 pl-10 pr-4 rounded-xl text-base focus:outline-none focus:ring-1 focus:ring-blue-500 text-black border border-gray-300 placeholder:text-gray-500 placeholder:text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end lg:w-1/3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent closing when clicking the button
                      setIsCalendarOpen(!isCalendarOpen);
                    }}
                    className="flex text-gray-500 items-center gap-2 lg:px-4 md:px-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <ListFilter className="h-4 w-4" />
                    <span className="text-xs">Filter</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <CalendarFilter
                    isOpen={isCalendarOpen}
                    onClose={() => setIsCalendarOpen(false)}
                    onSelect={handleDateSelect}
                  />
                </div>
              </div>
            </div>

            {isLoadingAttendance ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500 py-4">
                  {selectedDate ? 
                    "No records found for the selected date." : 
                    originalAttendanceRecords.length === 0 ? 
                      "No attendance records found for this user." : 
                      "No records match the current filters."}
                </p>
                {(selectedDate || searchQuery) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full relative overflow-x-auto">
                <table className="w-full justify-center item-center border-b border-gray-200 px-10 mt-6">
                  <thead className="border-b border-t-none border-gray-300">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Meeting Title
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {getCurrentItems().map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {record.MeetingTitle}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(record.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <EllipsisVertical className="w-5 h-5" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {attendanceRecords.length > 0 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDueRender;