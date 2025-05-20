'use client';
import React, { useState, useEffect } from 'react';
import { Star, CalendarDays, MapPin } from 'lucide-react';
import Image from 'next/image';
import apiClient from '@/services/apiClient';
import { parseCookies } from 'nookies';
import axios from 'axios';

// Interfaces for type safety
interface Feedback {
    id: string;
    comment: string;
    rating: number;
    createdAt: string;
    event: Event;
    userId: string; // Added userId property to feedback
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
    const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
    const [filter, setFilter] = useState('Recent First');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [is404Error, setIs404Error] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async (currentUserId: string) => {
            try {
                const eventsResponse = await apiClient.get('/events');
                let events = [];
                if (eventsResponse && eventsResponse.data) {
                    events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];
                } else if (Array.isArray(eventsResponse)) {
                    events = eventsResponse;
                }

                if (events.length === 0) {
                    setIsLoading(false);
                    setIs404Error(true);
                    return;
                }

                const firstEventId = events[0].id;
                console.log('Using event ID for API call:', firstEventId);

                fetchFeedbackWithEventId(firstEventId, currentUserId, events);
            } catch (err) {
                console.error('Error fetching events:', err);
                
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setIs404Error(true);
                } else {
                    setError('Failed to fetch events');
                }
                
                setIsLoading(false);
            }
        };

        const cookies = parseCookies();
        const userDataCookie = cookies['user_data'];
        const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
        const currentUserId = userData?.id;

        setUserId(currentUserId);
        console.log('User ID:', currentUserId);

        if (currentUserId) {
            fetchEvents(currentUserId);
        } else {
            setIsLoading(false);
            setError('User not authenticated. Please log in.');
        }
    }, []);

    const fetchFeedbackWithEventId = async (eventId: string, currentUserId: string, allEvents: Event[]) => {
        try {
            // Get all feedback for the event
            const feedbackResponse = await apiClient.get(`/events/${eventId}/feedback/user/${currentUserId}`);
            
            let allFeedback = [];
            if (feedbackResponse && feedbackResponse.data) {
                allFeedback = Array.isArray(feedbackResponse.data) ? feedbackResponse.data : [];
            } else if (Array.isArray(feedbackResponse)) {
                allFeedback = feedbackResponse;
            }
            
            console.log('All feedback:', allFeedback);
            
            // Filter feedback to only show those matching the current user ID
            const userFeedback = allFeedback.filter((feedback: any) => 
                feedback.userId === currentUserId
            );
            
            console.log('User feedback after filtering:', userFeedback);
            
            // Enrich feedback with event details
            const enrichedFeedback = userFeedback.map((feedback: any) => {
                // Find the matching event for this feedback
                const feedbackEventId = feedback.eventId;
                const eventDetails = allEvents.find(event => event.id === feedbackEventId) || null;
                
                return {
                    ...feedback,
                    event: eventDetails
                };
            });
            
            setFeedbackHistory(enrichedFeedback);
            setIsLoading(false);
            
        } catch (err) {
            console.error('Error fetching feedback:', err);
            
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setIs404Error(true);
                setFeedbackHistory([]);
            } else {
                setError('Failed to fetch your feedback history');
                setFeedbackHistory([]);
            }
            
            setIsLoading(false);
        }
    };

    // Sorting and filtering logic
    const sortedFeedback = React.useMemo(() => {
        const feedbackArray = Array.isArray(feedbackHistory) ? feedbackHistory : [];
        
        let sorted = [...feedbackArray];
        switch(filter) {
            case 'Newest to Oldest':
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'Oldest to Newest':
                sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'Highest Rated':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
        }
        return sorted;
    }, [feedbackHistory, filter]);
    
    const emptyFeedbackDisplay = (
        <div className="flex-grow flex items-center justify-center mt-40">
            <div className="text-center p-16">
                <div className="flex justify-center">
                    <Image src="/calendar.png" width={150} height={50} alt="calendar-image" />
                </div>
                <h2 className="mt-10 text-xl font-bold text-gray-800">No Feedback History</h2>
                <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                    You haven't submitted any feedback for events yet.
                </p>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-800"></div>
                    <p className="mt-4">Loading feedback history...</p>
                </div>
            </div>
        );
    }

    // Show the empty feedback display for 404 errors or when no feedback is available
    if (is404Error || feedbackHistory.length === 0) {
        return emptyFeedbackDisplay;
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
            {/* Header and Filter */}
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-xl font-bold">My Feedback History</h1>
                <div className="flex items-center">
                    {/* Filter dropdown */}
                    <div className="relative">
                        <select 
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm hover:bg-gray-50"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="Newest to Oldest">Newest to Oldest</option>
                            <option value="Oldest to Newest">Oldest to Newest</option>
                            <option value="Highest Rated">Highest Rated</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

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
                        <p className='text-base text-gray-600 font-semibold'>{feedback.event?.name || 'Event Details'}</p>
                        <div className="flex items-center text-sm text-gray-600 space-x-4">
                            <div className="flex items-center">
                                <CalendarDays className="w-4 h-4 mr-1" />
                                {feedback.event ? formatDate(feedback.event.date, 'full') : 'N/A'}
                            </div>
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {feedback.event?.venue || 'Unknown Location'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackHistoryTab;