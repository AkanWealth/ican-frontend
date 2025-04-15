"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  CircleAlert,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CalendarFilter from "@/components/homecomps/CalendarFilter";

interface Event {
  id: string;
  name: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  fee: number;
  mcpd_credit: number;
  flyer: string;
  meeting_link: string;
  status: string;
}

interface EventsTabProps {
  // events: any[];
  nigerianStates: string[];
}

const EventsTab: React.FC<EventsTabProps> = ({ nigerianStates }) => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] =
    useState("Select Date Range");

  useEffect(() => {
    const Token = localStorage.getItem("token");
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://ican-api-6000e8d06d3a.herokuapp.com/api/events",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${Token}`,
              "Content-Type": "application/json",
              // Add any additional headers like authorization if required
            },
          }
        );
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const hasEvents = events.length > 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationSelect = (state: string) => {
    setSelectedLocation(state);
    setIsLocationDropdownOpen(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDateRange(date);
    setIsCalendarOpen(false);
  };

  const handleRegister = (event: Event) => {
    const params = new URLSearchParams({
      id: event.id,
      topic: event.name,
      venue: event.venue,
      date: event.date,
      time: event.time,
      eventFee: event.fee.toString(),
      mcpd_credit: event.mcpd_credit.toString(),
      image: event.flyer,
      registeredNo: "0",
      totalSpot: "100",
      isFull: "false",
    });

    router.push(`/EventRegistration?${params.toString()}`);
  };

  const filteredEvents = events.filter((event) => {
    const matchesName = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDescription = event.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation
      ? event.venue.includes(selectedLocation)
      : true;

    return (matchesName || matchesDescription) && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8">
        Error: {error}
        <p>Unable to load events. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4">
        <h1 className="text-2xl md:text-xl font-bold mb-2">Events</h1>
        <div className="text-sm text-gray-800 ">
          Discover exciting happening around you!
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        <div className="w-1/2 lg:w-[400px] md:w-[300px]">
          <div className="relative group flex-1 p-2">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="w-5 h-5 text-black" />
            </div>
            <input
              type="text"
              placeholder="Search Events"
              className="w-full h-8 pl-8 pr-4 p-4 rounded-xl text-sm border border-gray-700
                       focus:outline-none focus:ring-1 focus:ring-blue-500
                       transition-colors text-black
                       placeholder:text-xs placeholder:text-black"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="flex flex-row w-1/2 gap-4 ">
          <div className="w-1/2 location-dropdown-container">
            <div className="relative group flex-1">
              <div className="absolute lg:left-4 sm:left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <div
                className="w-full h-8 lg:pl-12 md:pl-8 lg:pr-4 md:pr-2 py-2 rounded-xl text-xs border border-gray-700
                                focus:outline-none focus:ring-1 focus:ring-blue-500
                                transition-colors text-black cursor-pointer
                                flex items-center justify-between"
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
              >
                <span
                  className={selectedLocation ? "text-black" : "text-black"}
                >
                  {selectedLocation || "Location"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </div>

              {isLocationDropdownOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div
                    className="p-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
                    onClick={() => handleLocationSelect("")}
                  >
                    All Locations
                  </div>
                  {nigerianStates.map((state) => (
                    <div
                      key={state}
                      className="p-2 hover:bg-blue-50 cursor-pointer"
                      onClick={() => handleLocationSelect(state)}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-full md:w-1/2 relative">
            <div className="relative group flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <CalendarDays className="w-5 h-5 text-black" />
              </div>
              <input
                type="text"
                placeholder="Select Date Range"
                className="w-full h-8 lg:pl-12 md:pl-8 pr-4 rounded-xl text-sm border border-gray-700
                                focus:outline-none focus:ring-1 focus:ring-blue-500
                                 transition-colors text-black
                                placeholder:text-black cursor-pointer"
                value={selectedDateRange}
                readOnly
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              />
              <div className="relative">
                <CalendarFilter
                  isOpen={isCalendarOpen}
                  onClose={() => setIsCalendarOpen(false)}
                  onSelect={handleDateSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasEvents ? (
        <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 mt-8">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border rounded-lg relative">
              <div className="relative h-52 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={event.flyer}
                  alt={event.name}
                  fill
                  className="w-full h-full object-cover"
                />
                <div className="absolute flex flex-row top-4 right-4 text-primary bg-blue-50 rounded-full px-3 py-1 text-sm ">
                  <CircleAlert className="w-5 h-5 mr-2" />
                  {event.status}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{event.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {event.description}
                </p>

                <div className="flex flex-col text-sm gap-2 text-gray-600 mb-4">
                  <div className="flex">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </div>
                </div>
                <button
                  onClick={() => handleRegister(event)}
                  // disabled={event.isFull}
                  className="px-6 py-2 rounded-full transition-colors bg-blue-800 text-white hover:bg-blue-900"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center mt-40">
          <div className="text-center p-16">
            <div className="flex justify-center">
              <Image
                src="/calendar.png"
                width={150}
                height={50}
                alt="calendar-image"
              />
            </div>
            <h2 className="mt-10 text-xl font-bold text-gray-800">
              No Upcoming Events
            </h2>
            <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
              Please check back later for updates or explore other sections for
              more opportunities.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
