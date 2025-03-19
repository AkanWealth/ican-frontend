'use client';
import React, { useState, useEffect } from 'react';

import { Search, ChevronDown, ListFilter, ChevronUp, Bookmark, CircleDollarSign, SquareLibrary } from 'lucide-react';
import { FaBookmark } from 'react-icons/fa6';
import { useToast } from '@/hooks/use-toast';
import { Modal } from '@mui/material';
import Image from 'next/image';

interface Resource {
    id: number;
    type: string;
    title: string;
    date: string;
    isPremium: boolean;
    isBookmarked: boolean;
    icon: 'REC' | 'PDF' | 'VIDEO' | 'AUDIO';
}

function ResourcePage() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<string>('resource');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [sortBy, setShowSortBy] = useState<boolean>(false);
    const [filterBy, setShowFilterBy] = useState<boolean>(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    const [resources, setResources] = useState<Resource[]>([
        { 
            id: 1,
            type: 'webinar',
            title: 'Mastering Communication Skills in the Digital Age',
            date: '22, October 2024',
            isPremium: true,
            isBookmarked: false,
            icon: 'REC'
        },
        { 
            id: 2,
            type: 'article',
            title: '5 Strategies for Time Management in the Workplace',
            date: '22, October 2024',
            isPremium: false,
            isBookmarked: false,
            icon: 'PDF'
        },
        { 
            id: 3,
            type: 'video',
            title: 'The Future of Leadership: Insights for 2025',
            date: '22, October 2024',
            isPremium: true,
            isBookmarked: true,
            icon: 'VIDEO'
        },
        { 
            id: 4,
            type: 'audio',
            title: 'The Future of Leadership: Insights for 2025',
            date: '22, October 2024',
            isPremium: false,
            isBookmarked: false,
            icon: 'AUDIO'
        },
    ]);



    const [recommended, setRecommened] = useState<Resource[]>([
        { 
            id: 1,
            type: 'webinar',
            title: 'Mastering Communication Skills in the Digital Age',
            date: '22, October 2024',
            isPremium: false,
            isBookmarked: false,
            icon: 'REC'
        },
        { 
            id: 2,
            type: 'article',
            title: '5 Strategies for Time Management in the Workplace',
            date: '22, October 2024',
            isPremium: false,
            isBookmarked: false,
            icon: 'PDF'
        },
        { 
            id: 3,
            type: 'video',
            title: 'The Future of Leadership: Insights for 2025',
            date: '22, October 2024',
            isPremium: false,
            isBookmarked: false,
            icon: 'VIDEO'
        },
        { 
            id: 4,
            type: 'audio',
            title: 'The Future of Leadership: Insights for 2025',
            date: '22, October 2024',
            isPremium: false,
            isBookmarked: false,
            icon: 'AUDIO'
        },
    ]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setActiveTab(tab);
    };

    const handleBookmark = (id: number, isRecommended: boolean = false) => {
        if (isRecommended) {
           
            setRecommened(recommended.map(item => 
                item.id === id ? {...item, isBookmarked: !item.isBookmarked} : item
            ));
        } else {
           
            setResources(resources.map(resource => 
                resource.id === id ? {...resource, isBookmarked: !resource.isBookmarked} : resource
            ));
        }
    };
    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setShowFilterBy(false);
    };

    const handleSortSelect = (sortOption: string) => {
        
        if (sortOption === 'Latest') {
           
            const sorted = [...resources].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setResources(sorted);
        } else if (sortOption === 'Most viewed') {
         
            const sorted = [...resources].sort((a, b) => a.id - b.id);
            setResources(sorted);
        }
        setShowSortBy(false);
    };

    const filterTypes: string[] = ['Webinar', 'Video', 'Articles', 'Audio'];
    const sortOptions: string[] = ['Latest', 'Most viewed'];

    const filteredResources = resources.filter(resource => {
    
        if (activeTab === 'bookmark' && !resource.isBookmarked) return false;
        
     
        if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
    
        if (selectedFilter && resource.type.toLowerCase() !== selectedFilter.toLowerCase()) {
            return false;
        }
        
        return true;
    });

    const handleCancel = () => {
        setActiveTab('resource');
    };

    // Empty state component for when no resources are found
    const EmptyState = () => (
        <div className="flex-grow flex items-center justify-center mt-40">
            <div className="text-center p-16">
                <div className="flex justify-center">
                    <Image src="/office-material-document 1.png" width={150} height={50} alt="calendar-image" />
                </div>
                <h2 className="mt-10 text-xl font-bold text-gray-800">
                    No Resources Found
                </h2>
                <p className="mt-2 text-sm text-gray-800 max-w-lg mx-auto px-14">
                    It seems we couldn't find any resources at the moment. Please check back later or explore other categories to discover materials that match your interests.
                </p>
            </div>
        </div>
    );

    // Resource card component
    const ResourceCard = ({ resource }: { resource: Resource }) => (
        <div key={resource.id} className="border rounded-lg p-5 relative">
        {/* Top row with icon and bookmark */}
        <div className="flex justify-between items-start mb-2">
          {/* Left icon */}
          <div>
            {resource.icon === 'REC' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/rec.png" width={38} height={34} alt="rec-icon" />
              </div>
            )}
            {resource.icon === 'PDF' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/PdfIcon.png" width={38} height={34} alt="pdf-icon" />
              </div>
            )}
            {resource.icon === 'VIDEO' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/Utube.png" width={38} height={30} alt="video-icon" />
              </div>
            )}
            {resource.icon === 'AUDIO' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/Audio.png" width={38} height={30} alt="audio-icon" />
              </div>
            )}
          </div>
   
          <button 
            onClick={() => handleBookmark(resource.id)}
            className="text-gray-400 hover:text-blue-600"
            aria-label={resource.isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {resource.isBookmarked ? (
              <FaBookmark className="w-6 h-6 text-green-500" />
               
            ) : (
              <Bookmark className="w-6 h-6"/>
               
            )}
          </button>
        </div>
        

        <div className="mt-2">

          <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
          <div className='flex flex-row justify-between mb-2'>
                      <p className="text-sm text-primary font-semibold mb-2">{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</p>

          <div className="flex items-center mb-2">
            {resource.isPremium ? (
              <span className="text-green-500 mr-2 text-sm flex items-center">
                <CircleDollarSign className="w-4 h-4 mr-1" />
                 
                Premium
              </span>
            ):(<span className="text-gray-600 mr-2 text-sm flex items-center">
                <SquareLibrary className="w-4 h-4 mr-1"/>
                  
                Free
              </span>)}
          </div>
          </div>
          <div className="flex items-center text-xs text-gray-700 mb-3">
            <span>{resource.date}</span>
          </div>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
            View Details
          </button>
        </div>
      </div>
      );

    const renderResouceTab = () => {
   
        if (filteredResources.length === 0) {
            return <EmptyState />;
        }

        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
        );
    };


    const RecommendCard = ({ recommended }: { recommended: Resource }) => (
        <div key={recommended.id} className="border rounded-lg p-5 relative">
        {/* Top row with icon and bookmark */}
        <div className="flex justify-between items-start mb-2">
          {/* Left icon */}
          <div>
            {recommended.icon === 'REC' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/rec.png" width={38} height={34} alt="rec-icon" />
              </div>
            )}
            {recommended.icon === 'PDF' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/PdfIcon.png" width={38} height={34} alt="pdf-icon" />
              </div>
            )}
            {recommended.icon === 'VIDEO' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/Utube.png" width={38} height={30} alt="video-icon" />
              </div>
            )}
            {recommended.icon === 'AUDIO' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/Audio.png" width={38} height={30} alt="audio-icon" />
              </div>
            )}
          </div>
   
          <button 
                onClick={() => handleBookmark(recommended.id, true)} // Pass true to indicate this is a recommended item
                className="text-gray-400 hover:text-blue-600"
                aria-label={recommended.isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
                {recommended.isBookmarked ? (
                    <FaBookmark className="w-6 h-6 text-green-500" />
                    
                ) : (
                    <Bookmark className="w-6 h-6"/>
                    
                )}
            </button>
        </div>
        

        <div className="mt-2">

          <h3 className="text-lg font-semibold mb-2">{recommended.title}</h3>
          <div className='flex flex-row justify-between mb-2'>
                      <p className="text-sm text-primary font-semibold mb-2">{recommended.type.charAt(0).toUpperCase() + recommended.type.slice(1)}</p>

          <div className="flex items-center mb-2">
            {recommended.isPremium ? (
              <span className="text-green-500 mr-2 text-sm flex items-center">
                <CircleDollarSign className="w-4 h-4 mr-1" />
                 
                Premium
              </span>
            ):(<span className="text-gray-600 mr-2 text-sm flex items-center">
                <SquareLibrary className="w-4 h-4 mr-1"/>
                  
                Free
              </span>)}
          </div>
          </div>
          <div className="flex items-center text-xs text-gray-700 mb-3">
            <span>{recommended.date}</span>
          </div>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
            View Details
          </button>
        </div>
      </div>
      );

      const renderRecommendedTab = () => {
        // Filter recommended resources based on search and filters
        const filteredRecommended = recommended.filter(rec => {
            // Filter based on search query
            if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            // Filter based on selected filter
            if (selectedFilter && rec.type.toLowerCase() !== selectedFilter.toLowerCase()) {
                return false;
            }
            
            return true;
        });
        
        if (filteredRecommended.length === 0) {
            return <EmptyState />;
        }
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommended.map(rec => (
                    <RecommendCard key={rec.id} recommended={rec} />
                ))}
            </div>
        );
    };

    const renderBookmarkTab = () => {

        const bookmarkedResources = filteredResources.filter(resource => resource.isBookmarked);
        
        if (bookmarkedResources.length === 0) {
            return <EmptyState />;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookmarkedResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl md:text-2xl font-bold mb-4">Resource</h1>
            <p className='mb-6'>Explore articles, podcasts, videos, and webinars tailored to your professional development.</p>

            {/* Tabs Section - Improved for mobile */}
            <div className="w-full mb-4">
                <div className='flex w-full max-w-[410px] bg-gray-200 rounded-xl p-2'>
                    <button
                        onClick={() => handleTabChange('resource')}
                        className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg hover:bg-blue-700 ${activeTab === 'resource'
                            ? 'bg-primary text-white'
                            : 'text-gray-800 hover:bg-gray-300'
                            }`}>
                        Resources
                    </button>
                    <button
                        onClick={() => handleTabChange('recommended')}
                        className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg ${activeTab === 'recommended'
                            ? 'bg-primary text-white'
                            : 'text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        Recommended
                    </button>
                    <button
                        onClick={() => handleTabChange('bookmark')}
                        className={`flex-1 text-xs px-2 md:px-4 lg:px-8 py-2 rounded-lg  ${activeTab === 'bookmark'
                            ? 'bg-primary text-white'
                            : 'text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        Bookmark
                    </button>
                </div>
            </div>

            {/* Search and Filter - Improved for mobile */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative w-full sm:w-1/2">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title, tag, or category..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-sm placeholder:text-gray-500"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="relative flex-1 sm:flex-none">
                        <button
                            onClick={() => setShowFilterBy(!filterBy)}
                            className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <ListFilter className="h-4 w-4"/>   
                            <span className="text-sm">Filter</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                        {filterBy && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-36">
                                <div className="p-2">
                                    {filterTypes.map((filter, index) => (
                                        <div 
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleFilterSelect(filter.toLowerCase())}
                                        >
                                            {filter}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="relative flex-1 sm:flex-none">
                        <button
                            onClick={() => setShowSortBy(!sortBy)}
                            className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <span className="text-sm">Sort by</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                        {sortBy && (
                            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-36">
                                <div className="p-2">
                                    {sortOptions.map((option, index) => (
                                        <div 
                                            key={index}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleSortSelect(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {activeTab === 'resource' && renderResouceTab()}
            {activeTab === 'recommended' && renderRecommendedTab()}
            {activeTab === 'bookmark' && renderBookmarkTab()}
        </div>
    );
}

export default ResourcePage;