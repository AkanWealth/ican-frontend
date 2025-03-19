'use client';
import React, { useState, useEffect } from 'react';
import { Search, MapPin, CalendarDays, CircleAlert,ListFilter, ChevronDown,Star, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Modal } from '@mui/material';
import Image from 'next/image';
import { DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger, } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import FeedbackModal from './FeedbackModal';




function EventPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState('password');
   
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const registered : any[] = [
        {
            id: 1,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: true,
            topic: "Balancing Life and Mental Health",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
            
        
        },
        {
            id: 2,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: false,
            topic: "Essence of Bank Recapitalization",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
           
        },
        {
            id: 3,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: false,
            topic: "Balancing Life and Mental Health",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
            
        
        },
        {
            id: 4,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            IsAttended: true,
            topic: "Essence of Bank Recapitalization",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
           
        },
    ]
    const hasregistered = registered.length > 0;

    const events: any[] = [
        {
            id: 1,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            image: "/Event1.jpg",
            spots: "10 spots left",
            topic: "Essence of Bank Recapitalization",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
            dayAndDate: "SUNDAY 15TH SEPTEMBER",
            time: "4:00PM",
            eventPayment: true,
            eventFee: 20000,
            registeredNo: 20,
            totalSpot: 100,
            isFull: false
        },
        {
            id: 2,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            image: "/Event2.jpg",
            spots: "Spot full",
            month: "SEPTEMBER 2024 EDITION",
            topic: "Balancing Life and Mental Health",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
            dayAndDate: "SUNDAY 15TH SEPTEMBER",
            eventPayment: false,
            eventFee: 0,
            registeredNo: 100,
            totalSpot: 100,
            isFull: true
        },
        {
            id: 3,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            image: "/Event3.jpg",
            spots: "Spot full",
            month: "SEPTEMBER 2024 EDITION",
            topic: "Essence of Bank Recapitalization",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
            dayAndDate: "SUNDAY 15TH SEPTEMBER",
            time: "4:00PM",
            eventPayment: true,
            eventFee: 20000,
            registeredNo: 100,
            totalSpot: 100,
            isFull: true
        },
        {
            id: 4,
            date: "Friday, Jan 31 6:00 PM - 11:30 PM",
            location: "Grey Hall Conference, Lagos",
            image: "/Event1.jpg",
            spots: "10 spots left",
            month: "SEPTEMBER 2024 EDITION",
            topic: "Balancing Life and Mental Health",
            subtitle: "From networking opportunities to unforgettable entertainment, there’s something for everyone",
            dayAndDate: "SUNDAY 15TH SEPTEMBER",
            time: "4:00PM",
            eventPayment: false,
            eventFee: 0,
            registeredNo: 20,
            totalSpot: 100,
            isFull: false
        },
        
    ];

    const hasEvents = events.length > 0;

      const handleRegister = (event: { id: { toString: () => any; }; topic: any; image: any; isFull: any; totalSpot: any; registeredNo: any; date: any; location: any; eventPayment: any; eventFee: any; }) => {
        const params = new URLSearchParams({
            id: event.id.toString(),
            topic: event.topic,
            image: event.image,
            date: event.date,
            location: event.location,
            eventPayment: event.eventPayment,
            eventFee: event.eventFee || '0',
            totalSpot: event.totalSpot || '0',
            registeredNo: event.registeredNo || '0',
            isFull: event.isFull,
        });
        
        router.push(`/EventRegistration?${params.toString()}`);
    };

    const filterEvents = (events: any[]) => {
        switch (filterType) {
          case 'Past events':
            return events.filter(event => !event.IsAttended);
          case 'Upcoming events':
            return events.filter(event => !event.IsAttended); 
          case 'Updated events':
            return events.filter(event => events); 
          case 'Attended':
            return events.filter(event => event.IsAttended);
          default:
            return events;
        }
      };
    

    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setActiveTab(tab);
    };

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [feedbackData, setFeedbackData] = useState({
        rating: 0,
        comment: ''
    });
    const [errors, setErrors] = useState({
        rating: '',
        comment: ''
    });

    const [touched, setTouched] = useState({
        rating: false,
        comment: false
    });


    const handleOpenFeedbackModal = (event: any) => {
        setSelectedEvent(event);
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
        setSelectedEvent(null);
    };

    const handleSubmitFeedback = (feedbackData: { rating: number; comment: string }) => {
        toast({
            title: "Thank you for your feedback!",
            description: "We appreciate your input and will use it to improve future events.",
            variant: "default",
            duration: 3000,
        });
        
        setIsFeedbackModalOpen(false);
        setSelectedEvent(null);
    };

    useEffect(() => {
        if (!isFeedbackModalOpen) {
            setFeedbackData({ rating: 0, comment: '' });
            setErrors({ rating: '', comment: '' });
            setTouched({ rating: false, comment: false });
        }
    }, [isFeedbackModalOpen]);

    const validateField = (name: any, value: any) => {
        if (name === 'rating' && value === 0) {
            return 'Please rate your experience';
        }
        if (name === 'comment' && !value.trim()) {
            return 'Please provide your feedback';
        }
        return '';
    };

    const handleClickOutside = (e: { target: any; currentTarget: any; }) => {
        if (e.target === e.currentTarget) {
            setIsFeedbackModalOpen(false);
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        // Check all fields
        const newErrors = {
            rating: validateField('rating', feedbackData.rating),
            comment: validateField('comment', feedbackData.comment)
        };
        
        setErrors(newErrors);
        setTouched({ rating: true, comment: true });

        // If no errors, submit
        if (!newErrors.rating && !newErrors.comment) {
            handleSubmitFeedback(feedbackData);
            setIsFeedbackModalOpen(false);
        }
    };
   


    const [criteria, setCriteria] = useState({
        hasUpperCase: false,
        hasLowerCase: false,
        hasMinLength: false,
        hasSpecialChar: false
    });

    const [isFormValid, setIsFormValid] = useState(false);

  

    
    
    useEffect(() => {

        const allFieldsFilled = Object.values(formData).every(value => value !== '');
        const allCriteriaMet = Object.values(criteria).every(criterion => criterion);
        const passwordsMatch = formData.newPassword === formData.confirmPassword;

        setIsFormValid(allFieldsFilled && allCriteriaMet && passwordsMatch);
    }, [formData, criteria]);


    const showToastOnPasswordChange = () => {
        toast({
            title: "Password Changed",
            description: "Your password has been successfully updated.",
            variant: "default",
            duration: 30000,
        });
    };

    const showToastOnPasswordChangeError = () => {
        toast({
            title: "Error",
            description: "Failed to update password. Please try again.",
            variant: "destructive",
            duration: 3000,
        });
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
   
    const renderFeedbackTab = () => (
        <div className="flex flex-col w-full">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-xl font-bold">Feedback History</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-sm text-gray-800 rounded-lg w-28 bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
                        Filter
                        <ChevronDown className="w-4 h-5 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-38 bg-white z-50 text-xs border border-gray-300 rounded-lg text-gray-700 ">
                        <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2'>
                            Recent First
                        </DropdownMenuItem>
                        <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2'>
                            Oldest First
                        </DropdownMenuItem>
                        <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2'>
                            Highest Rated
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
    
            {feedbackHistory.length > 0 ? (
                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6">
                    {feedbackHistory.map((feedback) => (
                        <div 
                            key={feedback.id} 
                            className="border border-gray-200 rounded-lg p-6 bg-white"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-600">Submission Date {feedback.timestamp}</p>
                                {/* <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= feedback.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div> */}
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
                            <p className='text-base text-gray-600 font-semibold'>{feedback.topic}</p>
                            <div className="flex items-center text-sm text-gray-600 space-x-4">
                                
                                <div className="flex items-center">
                                    <CalendarDays className="w-4 h-4 mr-1" />
                                    {feedback.date}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Grey Hall Conference, Lagos
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // No Feedback History Display
                <div className="flex-grow flex items-center justify-center mt-40">
                    <div className="text-center p-16">
                        <div className="flex justify-center">
                            <Image src="/calendar.png" width={150} height={50} alt="calendar-image" />
                        </div>
                        <h2 className="mt-10 text-xl font-bold text-gray-800">
                            No Feedback History
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                            You haven't submitted any feedback yet. Attend events and share your experiences!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    const renderRegisteredTab = () => (
        <div className="flex flex-col w-full">
         <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl md:text-xl font-bold mb-2">Registered Event</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center text-sm text-gray-800 rounded-lg w-28 bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50">
            <ListFilter className="w-4 h-4 mr-1" />
            Filter
            <ChevronDown className="w-4 h-5 ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-38 bg-white z-50 text-xs border border-gray-300 rounded-lg text-gray-700 ">
            <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2' onClick={() => setFilterType('Past events')}>
              Past events
            </DropdownMenuItem>
            <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2' onClick={() => setFilterType('Upcoming events')}>
              Upcoming events
            </DropdownMenuItem>
            <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2' onClick={() => setFilterType('Updated events')}>
            Updated events
            </DropdownMenuItem>
            <DropdownMenuItem className='transition-colors hover:bg-blue-100 p-2' onClick={() => setFilterType('Attended')}>
              Attended
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

       

            {hasregistered ? (
                
                <><div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 mt-8">
                    {filterEvents(registered).map((registered) => (
                        <div key={registered.id} className="rounded-lg relative border-l-4 border-green-600 p-4 bg-white">
                            <div className="">
                                <span
                                    className={`rounded-full px-2 py-0.5 text-sm  ${registered.IsAttended
                                            ? 'text-green-700 bg-green-100 font-medium'
                                            : 'text-gray-700 bg-gray-100 font-medium'}`}
                                >
                                    {registered.IsAttended ? 'Attended' : 'Upcoming'}
                                </span>
                            </div>

                            <div className=''>
                                <h3 className="font-bold text-lg mb-2">{registered.topic}</h3>
                                <p className="text-sm text-gray-600 mb-4">{registered.subtitle}</p>

                                <div className="flex flex-col text-sm gap-2 text-gray-600 mb-4">
                                    <div className="flex">
                                        <CalendarDays className="w-4 h-4 mr-1" />
                                        {registered.date}
                                    </div>
                                    <div className="flex">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {registered.location}
                                    </div>
                                </div>
                                <div className='flex item-center justify-end gap-2 ml-4'>
                                    <button
                                        onClick={() => handleRegister(registered)}
                                        hidden={!registered.IsAttended}
                                        className={"px-6 py-2 rounded-full transition-colors border border-primary text-primary "}
                                    >
                                        Download certificate
                                    </button>
                                    <button
                                        onClick={() => handleOpenFeedbackModal(registered)}
                                        disabled={!registered.IsAttended}
                                        className={`px-6 py-2 rounded-full transition-colors ${!registered.IsAttended
                                            ? 'bg-blue-300 text-white cursor-not-allowed'
                                            : 'bg-blue-800 text-white'}`}
                                    >
                                        Write Feedback
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>   <FeedbackModal 
                        isOpen={isFeedbackModalOpen} 
                        onClose={handleCloseFeedbackModal}
                    />
                </>
            ) : (
                // No Events Display
                <div className="flex-grow flex items-center justify-center mt-40">
                    <div className="text-center p-16">
                        <div className="flex justify-center">
                            <Image src="/calendar.png" width={150} height={50} alt="calendar-image" />
                        </div>
                        <h2 className="mt-10 text-xl font-bold text-gray-800">
                            No Upcoming Events
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                            Please check back later for updates or explore other sections for more opportunities.
                        </p>
                    </div>
                </div>
            )}


            
        </div>

        

    );



    const renderEventTab = () => (
        
        <div className="flex flex-col w-full">
        <div className='mb-4'>
                <h1 className="text-2xl md:text-xl font-bold mb-2">Events</h1>
                <div className="text-sm text-gray-800 ">Discover exciting happening around you!</div>
            </div>

            <div className="flex items-center">
                <div className="w-[400px] lg:mr-40 md:mr-10 ">
                    <div className="relative group flex-1 p-2">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <Search className="w-5 h-5 text-black" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search Events"
                            className="w-full h-8 pl-12 pr-4 p-6 rounded-xl text-sm border border-gray-700
                       focus:outline-none  focus:ring-1 focus:ring-blue-500
                       text-base transition-colors text-black
                       placeholder:text-black"
                        />
                    </div>
                </div>
                <div className="w-[130px] mr-6">
                    <div className="relative group flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <MapPin className="w-5 h-5 text-black" />
                        </div>
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full h-8 pl-12 pr-4 rounded-xl text-sm border border-gray-700
                       focus:outline-none  focus:ring-1 focus:ring-blue-500
                       text-base transition-colors text-black
                       placeholder:text-black"
                        />
                    </div>
                </div>

                <div className="w-[300px]">
                    <div className="relative group flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <CalendarDays className="w-5 h-5 text-black" />
                        </div>
                        <input
                            type="text"
                            placeholder="Select Date Range"
                            className="w-full h-8 pl-12 pr-4 rounded-xl text-sm border border-gray-700
                       focus:outline-none  focus:ring-1 focus:ring-blue-500
                       text-base transition-colors text-black
                       placeholder:text-black"
                        />
                    </div>
                </div>



            </div>

            {hasEvents ? (
                // Events Grid
                <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6 mt-8">
                    {events.map((event) => (
                        <div key={event.id} className="border rounded-lg relative">
                            <div className="relative h-52 mb-4 rounded-lg overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.topic}
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <div className={`absolute flex flex-row top-4 right-4 text-primary bg-blue-50 rounded-full px-3 py-1 text-sm ${event.isFull ? 'text-red-600 bg-white font-semibold' : ''
                                    }`}>
                                    <CircleAlert className='w-5 h-5 mr-2'/>
                                    {event.spots}
                                </div>
                            </div>
                            <div className='p-4'>
                                <h3 className="font-bold mb-2">{event.topic}</h3>
                                <p className="text-sm text-gray-600 mb-4">{event.subtitle}</p>

                                <div className="flex flex-col text-sm gap-2 text-gray-600 mb-4">
                                    <div className="flex">
                                        <CalendarDays className="w-4 h-4" />
                                        {event.date}
                                    </div>
                                    <div className="flex">
                                        <MapPin className="w-4 h-4" />
                                        {event.location}
                                    </div>
                                </div>
                                <button
                                onClick={() => handleRegister(event)}
                                    disabled={event.isFull}
                                    className={`px-6 py-2 rounded-full transition-colors ${event.isFull
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-800 text-white hover:bg-blue-900'
                                        }`}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // No Events Display
                <div className="flex-grow flex items-center justify-center mt-40">
                    <div className="text-center p-16">
                        <div className="flex justify-center">
                            <Image src="/calendar.png" width={150} height={50} alt="calendar-image" />
                        </div>
                        <h2 className="mt-10 text-xl font-bold text-gray-800">
                            No Upcoming Events
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 max-w-lg mx-auto px-14">
                            Please check back later for updates or explore other sections for more opportunities.
                        </p>
                    </div>
                </div>
            )}
        </div>

    );




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
            {/* <div className='mb-4'>
                <h1 className="text-2xl md:text-xl font-bold mb-2">Events</h1>
                <div className="text-sm text-gray-800 ">{getTabDescription()}</div>
            </div> */}

            {activeTab === 'password' && renderEventTab()}
            {activeTab === 'notification' && renderRegisteredTab()}
            {activeTab === 'delete' && renderFeedbackTab()}
            



        </div>
    );
}

export default EventPage;
