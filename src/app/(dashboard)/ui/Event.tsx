'use client';
import React, { useState, useEffect } from 'react';
import EventsTab from '../TabRender/EventRender';
import RegisteredEventsTab from '../TabRender/RegisteredEventsTab';
import FeedbackHistoryTab from '../TabRender/FeedbackHistoryTab';

function EventPage() {
   
    const [activeTab, setActiveTab] = useState('password');
    const [userEmail, setUserEmail] = useState<string | null>(null);

    
   
  
    // Nigerian states
    const nigerianStates = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 
        'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 
        'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 
        'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ];



    const registered : any[] = [
        {
            id: 1,
            date: "Friday, Jan 31,2023 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: true,
            topic: "Balancing Life and Mental Health",
            subtitle: "From networking opportunities to unforgettable entertainment, there's something for everyone",
        },
        {
            id: 2,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: false,
            topic: "Essence of Bank Recapitalization",
            subtitle: "From networking opportunities to unforgettable entertainment, there's something for everyone",
        },
        {
            id: 3,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: false,
            topic: "Balancing Life and Mental Health",
            subtitle: "From networking opportunities to unforgettable entertainment, there's something for everyone",
        },
        {
            id: 4,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: true,
            topic: "Essence of Bank Recapitalization",
            subtitle: "From networking opportunities to unforgettable entertainment, there's something for everyone",
        },
    ]
   
    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setActiveTab(tab);
    };

   
    const feedbackHistory = [
        {
            id: 1,
            topic: "Balancing Life and Mental Health",
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            rating: 4,
            comment: "The event was overall great! The speakers were knowledgeable and engaging, and the topics covered were very relevant to current tech trends. I especially enjoyed the panel discussion on AI and its future ...read more",
            timestamp: "January 16, 2025"
        },
        {
            id: 2,
            topic: "Balancing Life and Mental Health",
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            rating: 4,
            comment: "The event was overall great! The speakers were knowledgeable and engaging, and the topics covered were very relevant to current tech trends. I especially enjoyed the panel discussion on AI and its future ...read more",
            timestamp: "January 16, 2025"
        },
        {
            id: 3,
            topic: "Balancing Life and Mental Health",
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            rating: 4,
            comment: "The event was overall great! The speakers were knowledgeable and engaging, and the topics covered were very relevant to current tech trends. I especially enjoyed the panel discussion on AI and its future ...read more",
            timestamp: "January 16, 2025"
        },
        {
            id: 4,
            topic: "Balancing Life and Mental Health",
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            rating: 4,
            comment: "The event was overall great! The speakers were knowledgeable and engaging, and the topics covered were very relevant to current tech trends. I especially enjoyed the panel discussion on AI and its future ...read more",
            timestamp: "January 16, 2025"
        }
    ];
    useEffect(() => {

        const userData = localStorage.getItem("user");
        if (userData) {
            try {
                const user = JSON.parse(userData);
                
                setUserEmail(user.email);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);
   
    return (
        <div className="py-6 px-4">
            <div className="w-full mb-4">
                <div className='flex w-full max-w-[700px] bg-gray-200 rounded-xl p-2'>
                    <button
                        onClick={() => handleTabChange('password')}
                        className={`flex-1 text-sm px-2 md:px-2 lg:px-4 lg:py-2 rounded-lg hover:bg-blue-700 ${activeTab === 'password'
                            ? 'bg-primary text-white'
                            : 'text-gray-800 hover:bg-gray-300'
                            }`}>
                        Events
                    </button>
                    <button
                        onClick={() => handleTabChange('notification')}
                        className={`flex-1 text-sm px-2 md:px-4 lg:px-8 py-2 rounded-lg ${activeTab === 'notification'
                            ? 'bg-primary text-white'
                            : 'text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        My Registered Events
                    </button>
                    <button
                        onClick={() => handleTabChange('delete')}
                        className={`flex-1 text-sm px-2 md:px-4 lg:px-8 py-2 rounded-lg ${activeTab === 'delete'
                            ? 'bg-primary text-white'
                            : 'text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        Feedback History
                    </button>
                </div>
            </div>

            {activeTab === 'password' && <EventsTab nigerianStates={nigerianStates} />}
            {activeTab === 'notification' && <RegisteredEventsTab />}
            {activeTab === 'delete' && <FeedbackHistoryTab  />}
        </div>
    );
}

export default EventPage