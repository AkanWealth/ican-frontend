'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, CalendarDays, MapPin, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

// Interfaces for type safety
interface Feedback {
    id: string;
    comment: string;
    rating: number;
    createdAt: string;
}

interface Event {
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
}
const formatDate = (dateString: string, format: 'relative' | 'full' = 'relative') => {
    const date = new Date(dateString);
    
    if (format === 'relative') {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        const minutes = Math.floor(diffInSeconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (diffInSeconds < 60) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
        
        // If more than a week, use full date format
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    // Full date format
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

const FeedbackHistoryTab: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
    const [filter, setFilter] = useState('Recent First');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setIsLoading(true);
                
                // Fetch list of events
                const eventsResponse = await axios.get<{data: Event[], meta: any}>('https://ican-api-6000e8d06d3a.herokuapp.com/api/events');
                
                // Extract events from the data property
                const fetchedEvents = eventsResponse.data.data;

                setEvents(fetchedEvents);
                
                // If there are events, select the first one by default
                if (fetchedEvents.length > 0) {
                    setSelectedEvent(fetchedEvents[0]);
                }
                
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to fetch events');
                setEvents([]);
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);


    useEffect(() => {
        const fetchFeedback = async () => {
            if (!selectedEvent) return;

            try {
                setIsLoading(true);
                if (typeof window === "undefined") return; // Ensure code runs only on the client side

                // Retrieve the token from localStorage
                const token = localStorage.getItem("token");

                const user = localStorage.getItem("user");
                const userId = user ? JSON.parse(user)?.id : null;
                // Fetch feedback for the selected event
                const feedbackResponse = await axios.get<{ data: Feedback[]; meta: any }>(
                    `https://ican-api-6000e8d06d3a.herokuapp.com/api/events/${userId}/feedback`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                            // "Content-Type": "application/json",
                        },
                    }
                );
                console.log("feedbackResponse", feedbackResponse);

                const fetchedFeedback = feedbackResponse.data.data || [];
                setFeedbackHistory(fetchedFeedback);

                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching feedback:", err);
                setError("Failed to fetch feedback history");
                setFeedbackHistory([]);
                setIsLoading(false);
            }
        };

        if (selectedEvent) {
            fetchFeedback();
        }
    }, [selectedEvent]);

    // Sorting and filtering logic
    const sortedFeedback = React.useMemo(() => {

        const feedbackArray = Array.isArray(feedbackHistory) ? feedbackHistory : [];
        
        let sorted = [...feedbackArray];
        switch(filter) {
            case 'Recent First':
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'Oldest First':
                sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'Highest Rated':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
        }
        return sorted;
    }, [feedbackHistory, filter]);

    // if (isLoading) {
    //     return (
    //         <div className="flex justify-center items-center h-full">
    //             <p>Loading...</p>
    //         </div>
    //     );
    // }

    if (isLoading) {
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
            <div className="flex justify-center items-center h-full text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {/* Event Selection Dropdown */}
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-xl font-bold">Feedback History</h1>
                <div className="flex items-center space-x-4">
                    {/* Event Selector */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-sm text-gray-800 rounded-lg w-48 bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
                            {selectedEvent ? selectedEvent.name : 'Select Event'}
                            <ChevronDown className="w-4 h-5 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white z-50 text-xs border border-gray-300 rounded-lg text-gray-700">
                            {events.map((event) => (
                                <DropdownMenuItem 
                                    key={event.id}
                                    className='transition-colors hover:bg-blue-100 p-2'
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {event.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent> */}
                    {/* </DropdownMenu> */}

                    {/* Feedback Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-sm text-gray-800 rounded-lg w-28 bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
                            Filter
                            <ChevronDown className="w-4 h-5 ml-2" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-38 bg-white z-50 text-xs border border-gray-300 rounded-lg text-gray-700 ">
                            <DropdownMenuItem 
                                className='transition-colors hover:bg-blue-100 p-2'
                                onClick={() => setFilter('Recent First')}
                            >
                                Recent First
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className='transition-colors hover:bg-blue-100 p-2'
                                onClick={() => setFilter('Oldest First')}
                            >
                                Oldest First
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className='transition-colors hover:bg-blue-100 p-2'
                                onClick={() => setFilter('Highest Rated')}
                            >
                                Highest Rated
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {sortedFeedback.length > 0 ? (
                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6">
                    {sortedFeedback.map((feedback) => (
                        <div 
                            key={feedback.id} 
                            className="border border-gray-200 rounded-lg p-6 bg-white"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">Submission Date {formatDate(feedback.createdAt)}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-800 text-lg">Feedback/Comment</p>
                                <p className="text-gray-800 text-sm">
                                    {feedback.comment.length > 150 
                                        ? `${feedback.comment.slice(0, 150)}...`
                                        : feedback.comment}
                                    {feedback.comment.length > 150 && (
                                        <span className="text-blue-600 ml-1 cursor-pointer">read more</span>
                                    )}
                                </p>
                                <div className="flex mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 ${
                                                star <= feedback.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <hr className='border border-gray-300 mb-4'></hr>
                            <p className='text-base text-gray-600 font-semibold'>{selectedEvent?.name || 'Event Details'}</p>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                                <div className="flex items-center">
                                    <CalendarDays className="w-4 h-4 mr-1" />
                                    {selectedEvent ? formatDate(selectedEvent.date, 'full') : 'N/A'}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {selectedEvent?.venue || 'Unknown Location'}
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
                            No Feedback History
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                            No feedback has been submitted for this event yet.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackHistoryTab;