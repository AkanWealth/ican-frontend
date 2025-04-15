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

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    venue: string;
    IsAttended: boolean;
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

    useEffect(() => {
        const fetchUserRegistrations = async () => {
            setLoading(true);
            try {
                // Get authentication details
                const token = localStorage.getItem('token');
                const userJson = localStorage.getItem('user');
                
                if (!token || !userJson) {
                    console.log('Missing authentication data');
                    setError('User is not authenticated. Please log in again.');
                    setLoading(false);
                    return;
                }
                
                // Parse user data with error handling
                let user;
                try {
                    user = JSON.parse(userJson);
                } catch (parseError) {
                    console.error('Failed to parse user data:', parseError);
                    setError('Invalid user data. Please log in again.');
                    setLoading(false);
                    return;
                }
                
                const email = user?.email;
                
                if (!email) {
                    console.log('No email found in user data');
                    setError('User email not found. Please log in again.');
                    setLoading(false);
                    return;
                }
        
                console.log('Fetching registrations for:', email);
                
                // Fetch user registrations
                const registrationsResponse = await axios.get(
                    `${BASE_API_URL}/events/registrations/user/${email}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`, 
                            'Content-Type': 'application/json',
                        },
                    }
                );
                
                console.log('Registration response:', registrationsResponse);
        
                // Check if response exists and contains data
                if (!registrationsResponse?.data) {
                    console.log('No data in registration response');
                    setRegisteredEvents([]);
                    setLoading(false);
                    return;
                }
        
                // Looking at your console log, the registration data is directly in response.data
                // and it appears to be a single object, not an array
                const registrationData = registrationsResponse.data;
                
                // Convert the single registration object to an array with one item
                const registrationsData = [registrationData];
                
                console.log('Processed registrations data:', registrationsData);
        
                if (!registrationData || !registrationData.eventId) {
                    console.log('No registered events found or missing eventId');
                    setRegisteredEvents([]);
                    setLoading(false);
                    return;
                }
        
                // Map to store registrations by event ID
                const registrationsMap: Record<string, Registration[]> = {};
                if (!registrationsMap[registrationData.eventId]) {
                    registrationsMap[registrationData.eventId] = [];
                }
                registrationsMap[registrationData.eventId].push(registrationData);
                
                console.log('Registrations map created:', Object.keys(registrationsMap).length);
        
                // Fetch event details for the registration
                const eventsData: Event[] = [];
                
                try {
                    const eventResponse = await axios.get(
                        `${BASE_API_URL}/events/${registrationData.eventId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    console.log('Event response:', eventResponse);
                    
                    if (eventResponse?.data) {
                        // Extract event data depending on response structure
                        const eventData = eventResponse.data.data || eventResponse.data;
                        eventsData.push(eventData);
                        console.log('Event data fetched:', eventData);
                    }
                } catch (eventError) {
                    console.error(`Failed to fetch event ${registrationData.eventId}:`, eventError);
                }
                
                console.log('Events data fetched:', eventsData.length);
        
                setEvents(eventsData);
                setRegisteredEvents(eventsData);
                setRegistrationsMap(registrationsMap);
            } catch (err) {
                console.error('Error in fetchUserRegistrations:', err);
                
                if (axios.isAxiosError(err)) {
                    const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch registered events';
                    console.error('Axios error details:', err.response?.data);
                    setError(`${errorMessage}. Please try again later.`);
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };
        if (typeof window !== 'undefined') {
            fetchUserRegistrations();
        }
    }, []);

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
                    <Image src="/calendar.png" width={150} height={50} alt="calendar-image" />
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
{/* 
                            <div className="text-sm text-gray-500 mb-4">
                                Registrations: {registrationsMap[event.id]?.length || 0}
                            </div> */}

                            <div className="flex items-center justify-end gap-2 ml-4">
                                {event.IsAttended && (
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