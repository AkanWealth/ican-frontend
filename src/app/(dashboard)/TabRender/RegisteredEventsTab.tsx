'use client';
import React, { useState, useEffect } from 'react';
import { ListFilter, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import FeedbackModal from '../ui/FeedbackModal';
import CertificateGenerator from '@/components/homecomps/CertificateGenerator';
import axios from 'axios';

interface Event {
    id: string;
    topic: string;
    subtitle: string;
    date: string;
    location: string;
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchUserRegistrations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const email = user.email;

                if (!token || !email) {
                    setError('User is not authenticated. Please log in again.');
                    setLoading(false);
                    return;
                }

                // Fetch user registrations
                const registrationsResponse = await axios.get(
                    'https://ican-api-6000e8d06d3a.herokuapp.com/api/events/registrations/user-events',
                    {
                        params: { email },
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                // Ensure the response contains the expected data structure
                const registrationsData: Registration[] = registrationsResponse.data?.data || [];

                if (!Array.isArray(registrationsData) || registrationsData.length === 0) {
                    setRegisteredEvents([]); // Set empty list for no registered events
                    setLoading(false);
                    return;
                }

                // Map to store registrations by event ID
                const registrationsMap: Record<string, Registration[]> = {};
                registrationsData.forEach((registration) => {
                    if (!registrationsMap[registration.eventId]) {
                        registrationsMap[registration.eventId] = [];
                    }
                    registrationsMap[registration.eventId].push(registration);
                });

                // Fetch event details for each registration
                const eventPromises = registrationsData.map(async (registration) => {
                    const eventResponse = await axios.get(
                        `http://localhost:4000/api/events/${registration.eventId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    return eventResponse.data;
                });

                const eventsData: Event[] = await Promise.all(eventPromises);

                setEvents(eventsData);
                setRegisteredEvents(eventsData);
                setRegistrationsMap(registrationsMap);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error('Error details:', err.response ? err.response.data : err.message);
                } else {
                    console.error('Error details:', err);
                }
                setError('Failed to fetch registered events. Please try again later.');
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
        setSelectedEventId(event.id); // Set the selected event ID
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
        setSelectedEvent(null);
        setSelectedEventId(null); // Reset selected event ID
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
        return <div className="text-center mt-10">Loading registered events...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
    }

    if (registeredEvents.length === 0) {
        return (
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

            {registeredEvents.length > 0 ? (
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
                                <h3 className="font-bold text-lg mb-2">{event.topic}</h3>
                                <p className="text-sm text-gray-600 mb-4">{event.subtitle}</p>

                                <div className="flex flex-col text-sm gap-2 text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <CalendarDays className="w-4 h-4 mr-1" />
                                        {event.date}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {event.location}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500 mb-4">
                                    Registrations: {registrationsMap[event.id]?.length || 0}
                                </div>

                                <div className="flex items-center justify-end gap-2 ml-4">
                                    
                                        <CertificateGenerator
                                            eventId={event.id}
                                            eventTitle={event.topic}
                                        />
                                    <button
                                        onClick={() => handleOpenFeedbackModal(event)}
                                        className={`px-6 py-2 rounded-full transition-colors ${
                                            !event.IsAttended
                                                ? 'bg-blue-800 text-white'
                                                : 'bg-blue-800 text-white'
                                        }`}
                                    >
                                        Write Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
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
            )}

            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={handleCloseFeedbackModal}
                eventId={selectedEventId}
            />
        </div>
    );
};

export default RegisteredEventsTab;