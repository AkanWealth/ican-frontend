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
import { Checkbox } from "@mui/material";

function MemberDueRender() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>("All");

  // Metrics state
  const [metrics, setMetrics] = useState({
    totalMeetings: 4,
    numberRegistered: 4,
    numberAttended: 4,
  });

  const itemsPerPage = 4;

  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
  // Example data for all activities (used for metrics calculation only)
  const allActivitiesData = useMemo(
    () => [
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Jan 15, 2022",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Feb 15, 2024",
        status: "absent",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Mar 15, 2023",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Apr 15, 2025",
        status: "absent",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "May 15, 2022",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Jun 15, 2024",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Jul 15, 2023",
        status: "absent",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Aug 15, 2025",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Jan 20, 2022",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Feb 20, 2024",
        status: "present",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Mar 20, 2023",
        status: "absent",
      },
      {
        MeetingTitle: "Monthly ICAN Surulere and District Meeting",
        date: "Sep 15, 2025",
        status: "present",
      },
    ],
    []
  );

  // Table data (not affected by month filter)
  const [activities, setActivities] = useState([
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Jan 15, 2022",
      status: "present",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Feb 15, 2024",
      status: "absent",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Mar 15, 2023",
      status: "present",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Apr 15, 2025",
      status: "absent",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "May 15, 2022",
      status: "present",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Jun 15, 2024",
      status: "present",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Jul 15, 2023",
      status: "absent",
    },
    {
      MeetingTitle: "Monthly ICAN Surulere and District Meeting",
      date: "Aug 15, 2025",
      status: "present",
    },
  ]);

  const [originalActivities, setOriginalActivities] = useState([...activities]);

  const resetActivities = () => {
    setActivities([...originalActivities]);
  };

  const updateMetrics = (filteredActivities: any[]) => {
    const totalMeetings = filteredActivities.length;
    const numberAttended = filteredActivities.filter(
      (activity) => activity.status === "present"
    ).length;

    setMetrics({
      totalMeetings,
      numberRegistered: totalMeetings,
      numberAttended,
    });
  };

  // Effect to update metrics when selectedMonth changes
  useEffect(() => {
    if (selectedMonth === "All") {
      updateMetrics(allActivitiesData);
    } else {
      const shortMonth = shortMonths[selectedMonth as keyof typeof shortMonths];
      const filteredForMetrics = allActivitiesData.filter((activity) =>
        activity.date.startsWith(shortMonth)
      );
      updateMetrics(filteredForMetrics);
    }
  }, [selectedMonth, allActivitiesData, shortMonths]);

  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const filteredActivities = activities.filter(
    (activity) =>
      activity.MeetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.status.toLowerCase().includes(searchQuery)
  );

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);

    const selectedDateObj = new Date(date);

    const filteredActivities = originalActivities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === selectedDateObj.getDate() &&
        activityDate.getMonth() === selectedDateObj.getMonth() &&
        activityDate.getFullYear() === selectedDateObj.getFullYear()
      );
    });

    setActivities(filteredActivities);
  };

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    setIsMonthDropdownOpen(false);
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
      <div className="">
        <div className="max-w-6xl mx-auto">
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
                    <p className="font-bold text-3xl">
                      {metrics.totalMeetings}
                    </p>
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
                    <p className="font-bold text-3xl">
                      {metrics.numberRegistered}
                    </p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 gap-4">
                    <div className="flex item-center mb-4">
                      <div className="flex bg-green-300 w-[2rem] h-[2rem] p-2 rounded-lg item-center justify-center mr-2">
                        <Mic className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm text-center p-2">Number Attended</p>
                    </div>
                    <p className="font-bold text-3xl">
                      {metrics.numberAttended}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white max-w-[1100px] flex flex-col item-center rounded-xl border border-gray-300 p-6 mb-10">
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

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500 py-4">
                  No Record found for the selected date.
                </p>
                <button
                  onClick={resetActivities}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="relative overflow-x-auto">
                <table className="w-full justify-center item-center border-b border-gray-200 px-10 mt-6">
                  <thead className="border-b border-t-none border-gray-300">
                    <tr>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Meeting Title
                      </th>
                      <th className="text-left px-6 py-3 text-sm font-semibold text-gray-500">
                        Due Created
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
                    {getCurrentItems().map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {activity.MeetingTitle}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                          {activity.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatusBadge(activity.status)}
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

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDueRender;
