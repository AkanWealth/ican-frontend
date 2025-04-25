'use client';
import React, { useState, useEffect } from 'react';
import { ListFilter, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import FeedbackModal from '../ui/FeedbackModal';
import CertificateGenerator from '@/components/homecomps/CertificateGenerator';
import axios from 'axios';
import { BASE_API_URL } from "@/utils/setter";
import apiClient from '@/services/apiClient';
import { parseCookies } from "nookies";

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    venue: string;
    IsAttended: boolean;
    status: string; // Added status field
}

interface Registration {
    id: string;
    fullName: string;
    email: string;
    membership: string;
    eventId: string;
    status: string;
    proofOfPayment: string;
    createdAt: string;
    userId: string | null;
    event: {
        id: string;
        name: string;
        venue: string;
        description: string;
        date: string;
        time: string;
        fee: number;
        mcpd_credit: number;
        flyer: string | null;
        meeting_link: string | null;
        status: string;
        createdAt: string;
    };
}

const RegisteredEventsTab: React.FC = () => {
    const router = useRouter();
    const [filterType, setFilterType] = useState('all');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
    const [registrationsMap, setRegistrationsMap] = useState<Record<string, Registration[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Get user ID from cookies
        if (typeof window !== 'undefined') {
            const cookies = parseCookies();
            const userDataCookie = cookies['user_data'];
            const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
            const currentUserId = userData?.id;
            setUserId(currentUserId);
            
            if (currentUserId) {
                fetchUserRegistrations(currentUserId);
            } else {
                setLoading(false);
                setError("User ID not found in cookies");
            }
        }
    }, []);

    const fetchUserRegistrations = async (currentUserId: string) => {
        setLoading(true);
        try {
            // Fetch user registrations
            const registrationsResponse = await apiClient.get(`/events/registrations/user-events/${currentUserId}`);
            console.log("registration", registrationsResponse?.data);
            
            // Check if the response has data and access the array properly
            if (!registrationsResponse?.data || !Array.isArray(registrationsResponse.data)) {
                console.log('No valid registration data in response');
                setRegisteredEvents([]);
                setLoading(false);
                return;
            }
            
            // Get the array of registrations
            const registrationsArray = registrationsResponse.data as Registration[];
            console.log('Registrations array:', registrationsArray);
            
            if (registrationsArray.length === 0) {
                setRegisteredEvents([]);
                setLoading(false);
                return;
            }
    
            // Create map of registrations by event ID
            const registrationsMap: Record<string, Registration[]> = {};
            
            // Process each registration
            registrationsArray.forEach((registration: Registration) => {
                if (registration.eventId && registration.userId === currentUserId) {
                    if (!registrationsMap[registration.eventId]) {
                        registrationsMap[registration.eventId] = [];
                    }
                    registrationsMap[registration.eventId].push(registration);
                }
            });
            
            // Extract event data from the registrations
            const eventsData: Event[] = registrationsArray
                .filter((registration: Registration) => 
                    registration.event && registration.userId === currentUserId
                )
                .map((registration: Registration) => {
                    // Format the event data to match our Event interface
                    return {
                        id: registration.event.id,
                        name: registration.event.name,
                        description: registration.event.description,
                        date: new Date(registration.event.date).toLocaleDateString() + " " + registration.event.time,
                        venue: registration.event.venue,
                        IsAttended: registration.status === "ATTENDED", // Set IsAttended based on status
                        status: registration.status // Add status field
                    };
                })
                .filter((event: Event, index: number, self: Event[]) => 
                    // Remove duplicates based on event ID
                    index === self.findIndex((e: Event) => e.id === event.id)
                );
            
            setEvents(eventsData);
            setRegisteredEvents(eventsData);
            setRegistrationsMap(registrationsMap);
        } catch (err) {
            console.error('Error in fetchUserRegistrations:', err);
            
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch registered events';
                setError(`${errorMessage}. Please try again later.`);
            } else {
                setError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFeedbackModal = (event: Event) => {
        setSelectedEvent(event);
        setSelectedEventId(event.id);
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
        setSelectedEvent(null);
        setSelectedEventId(null);
    };

    const filterEvents = (events: Event[]) => {
        switch (filterType) {
            case 'Past events':
                return events.filter(event => !event.IsAttended);
            case 'Upcoming events':
                return events.filter(event => !event.IsAttended);
            case 'Updated events':
                return events;
            case 'Attended':
                return events.filter(event => event.IsAttended);
            default:
                return events;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
                    <p className="mt-4">Loading registered events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 mt-10">
                <div className="text-red-500 mb-4">
                    <svg className="inline-block h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p className="text-gray-700">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const emptyEventsDisplay = (
        <div className="flex-grow flex items-center justify-center mt-40">
            <div className="text-center p-16">
                <div className="flex justify-center">
                    <Image src="/calendar.png" width={150} height={150} alt="calendar-image" />
                </div>
                <h2 className="mt-10 text-xl font-bold text-gray-800">No Registered Events</h2>
                <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                    Please check back later for updates or explore other sections for more opportunities.
                </p>
            </div>
        </div>
    );

    if (registeredEvents.length === 0) {
        return emptyEventsDisplay;
    }

    return (
        <div className="flex flex-col w-full">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-xl font-bold mb-2">Registered Events</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-sm text-gray-800 rounded-lg w-28 bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
                        <ListFilter className="w-4 h-4 mr-1" />
                        Filter
                        <ChevronDown className="w-4 h-5 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-38 bg-white z-50 text-xs border border-gray-300 rounded-lg text-gray-700 ">
                        {['Past events', 'Upcoming events', 'Updated events', 'Attended'].map((filter) => (
                            <DropdownMenuItem
                                key={filter}
                                className="transition-colors hover:bg-blue-100 p-2"
                                onClick={() => setFilterType(filter)}
                            >
                                {filter}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 mt-8">
                {filterEvents(registeredEvents).map((event) => (
                    <div key={event.id} className="rounded-lg relative border-l-4 border-green-600 p-4 bg-white">
                        <div className="">
                            <span
                                className={`rounded-full px-2 py-0.5 text-sm  ${
                                    event.IsAttended
                                        ? 'text-green-700 bg-green-100 font-medium'
                                        : 'text-gray-700 bg-gray-100 font-medium'
                                }`}
                            >
                                {event.IsAttended ? 'Attended' : 'Not Attended'}
                            </span>
                        </div>

                        <div className="">
                            <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{event.description}</p>

                            <div className="flex flex-col text-sm gap-2 text-gray-600 mb-4">
                                <div className="flex items-center">
                                    <CalendarDays className="w-4 h-4 mr-1" />
                                    {event.date}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.venue}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 ml-4">
                                {event.IsAttended && event.status === "ATTENDED" && (
                                    <CertificateGenerator
                                        eventId={event.id}
                                        eventTitle={event.name}
                                    />
                                )}
                                <button
                                    onClick={() => handleOpenFeedbackModal(event)}
                                    className="px-6 py-2 rounded-full transition-colors bg-blue-800 text-white hover:bg-blue-700"
                                >
                                    Write Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={handleCloseFeedbackModal}
                eventId={selectedEventId}
            />
        </div>
    );
};

export default RegisteredEventsTab;