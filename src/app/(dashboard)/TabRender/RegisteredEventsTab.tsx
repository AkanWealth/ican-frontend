'use client';
import React, { useState, useEffect } from 'react';
import { ListFilter, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import FeedbackModal from '../ui/FeedbackModal';
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

    const fetchUserRegisteredEvents = async () => {
        try {
            setLoading(true);
            
            // Fetch all events
            const eventsResponse = await axios.get('https://ican-api-6000e8d06d3a.herokuapp.com/api/events');
            const fetchedEvents = eventsResponse.data.data;

            // Create a map to store registrations for each event
            const registrationsMapTemp: Record<string, Registration[]> = {};

            // Fetch registrations for each event
            const registeredEventsWithDetails = await Promise.all(
                fetchedEvents.map(async (event: Event) => {
                    try {
                        const registrationsResponse = await axios.get(
                            `https://ican-api-6000e8d06d3a.herokuapp.com/api/events/${event.id}/registrations`
                        );
                        
                      
                        registrationsMapTemp[event.id] = registrationsResponse.data.data;

                      
                        console.log(`Registrations for event ${event.topic}:`, registrationsResponse.data.data);

                        return registrationsResponse.data.data.length > 0 ? event : null;
                    } catch (err) {
                        console.error(`Error fetching registrations for event ${event.id}:`, err);
                        return null;
                    }
                })
            );

            // Filter out null values (events with no registrations)
            const userRegisteredEvents = registeredEventsWithDetails.filter(event => event !== null);

            // Debug: Log all registered events
            console.log('Registered Events:', userRegisteredEvents);
            console.log('Registrations Map:', registrationsMapTemp);

            setEvents(fetchedEvents);
            setRegisteredEvents(userRegisteredEvents);
            setRegistrationsMap(registrationsMapTemp);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch registered events');
            setLoading(false);
            console.error('Registered events fetch error:', err);
        }
    };

    useEffect(() => {
        fetchUserRegisteredEvents();
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
                                className='transition-colors hover:bg-blue-100 p-2' 
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
                                    className={`rounded-full px-2 py-0.5 text-sm  ${event.IsAttended
                                            ? 'text-green-700 bg-green-100 font-medium'
                                            : 'text-gray-700 bg-gray-100 font-medium'}`}
                                >
                                    {event.IsAttended}
                                </span>
                            </div>

                            <div className=''>
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
                                
                                {/* Debug: Show number of registrations for this event */}
                                <div className="text-sm text-gray-500 mb-4">
                                    Registrations: {registrationsMap[event.id]?.length || 0}
                                </div>

                                <div className='flex items-center justify-end gap-2 ml-4'>
                                    <button
                                        onClick={() => {/* Add certificate download logic */}}
                                        // hidden={!event.IsAttended}
                                        className="px-6 py-2 rounded-full transition-colors border border-primary text-primary"
                                    >
                                        Download certificate
                                    </button>
                                    <button
                                        onClick={() => handleOpenFeedbackModal(event)}
                                        // disabled={!event.IsAttended}
                                        className={`px-6 py-2 rounded-full transition-colors ${!event.IsAttended
                                            ? 'bg-blue-800 text-white'
                                            : 'bg-blue-800 text-white'}`}
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
                        <h2 className="mt-10 text-xl font-bold text-gray-800">
                            No Registered Events
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                            Please check back later for updates or explore other sections for more opportunities.
                        </p>
                    </div>
                </div>
            )}

            {/* Pass registrations to the feedback modal */}
            <FeedbackModal 
                isOpen={isFeedbackModalOpen} 
                onClose={handleCloseFeedbackModal}
                eventId={selectedEventId} // Pass the event ID
            />
        </div>
    );
};

export default RegisteredEventsTab;