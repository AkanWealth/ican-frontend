"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, ChevronDown, ListFilter, Bookmark, CircleDollarSign, SquareLibrary } from 'lucide-react';
import { FaBookmark } from 'react-icons/fa6';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import ResourceDetailsModal from '../ModalPage/ResourceModalPage';
import { BASE_API_URL } from "@/utils/setter";
import apiClient from '@/services/apiClient';
import { parseCookies } from 'nookies';

interface Resource {
    id: string; // Changed to string since API returns UUIDs
    type: string;
    title: string;
    date?: string;
    createdAt?: string; // Added to match API response
    isPremium?: boolean;
    access?: string; // Added to match API response
    isBookmarked?: boolean;
    icon?: 'WEBINAR' | 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'PODCAST';
    description?: string;
    duration?: string;
    fileUrl?: string; // Added to match API response
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
    const [resourceDetails, setResourceDetails] = useState<Resource | null>(null);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [resources, setResources] = useState<Resource[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
    const [recommended, setRecommended] = useState<Resource[]>([]);

    const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
    const [bookmarksLoading, setBookmarksLoading] = useState<boolean>(false);

    // Fetch all resources
    useEffect(() => {
        const fetchResources = async () => {
          try {
            setLoading(true); 
            const token = localStorage.getItem("token");
    
            console.log('Token:', token);
    
            const response = await axios.get(
              `${BASE_API_URL}/resources/contents`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              }
            );
            
            // Fix: Extract the data array from response
            const resourcesData = response.data.data || [];
            
            // Transform data to match our interface
            const formattedResources = resourcesData.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              type: item.type,
              date: new Date(item.createdAt).toLocaleDateString(),
              createdAt: item.createdAt,
              isPremium: item.access === "PREMIUM",
              isBookmarked: false, // Default value, will be updated by bookmark API
              icon: item.type // Using type as icon
            }));
            
            setResources(formattedResources); 
            console.log('Resources:', formattedResources);
          } catch (error) {
            console.error('Error fetching resources:', error);
            toast({
              title: 'Error',
              description: 'Failed to fetch resources. Please try again later.',
              variant: 'destructive',
            });
          } finally {
            setLoading(false); 
          }
        };
    
        fetchResources();
    }, [toast]);

    // Fetch recommended resources
    useEffect(() => {
        const fetchRecommendedResources = async () => {
          try {
            setLoading(true);
            const response = await apiClient.get(`/resources/recommended`);
            
            // Check if response is an array
            const recommendedData = Array.isArray(response) ? response : 
                          (response.data ? response.data : []);
            
            // Transform data to match our interface
            const formattedRecommended = recommendedData.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              type: item.type,
              date: new Date(item.createdAt).toLocaleDateString(),
              isPremium: item.access === "PREMIUM",
              isBookmarked: false,
              icon: item.type
            }));
            
            setRecommended(formattedRecommended);
            console.log('Recommended Resources:', formattedRecommended);
          } catch (error) {
            console.error('Error fetching recommended resources:', error);
            toast({
              title: 'Error',
              description: 'Failed to fetch recommended resources',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
          }
        };
      
        fetchRecommendedResources();
    }, [toast]);


    const fetchBookmarkedResources = useCallback(async () => {
      try {
        setBookmarksLoading(true);
        if (typeof window === "undefined") return;
    
        const cookies = parseCookies();
        const userDataCookie = cookies['user_data'];
        const userData = userDataCookie ? JSON.parse(userDataCookie) : null;
        const userId = userData?.id;
        console.log("userId", userId);
        
        const response = await apiClient.get(`/resources/bookmarks`);
        
        // Check if response is an array
        const bookmarksData = Array.isArray(response) ? response : 
                    (response.data ? response.data : []);
        
        const filteredBookmarks = bookmarksData.filter((item: any) => 
          item.userId === userId || 
          (item.resource && item.userId === userId)
        );
        
        const bookmarkedItems = filteredBookmarks.map((item: any) => ({
          ...(item.resource || item), // Use the nested resource data if available
          isBookmarked: true,
          date: new Date(item.createdAt || item.resource?.createdAt).toLocaleDateString()
        }));
        
        setBookmarkedResources(bookmarkedItems);
        console.log('Bookmarked Resources:', bookmarkedItems);
      } catch (error) {
        console.error('Error fetching bookmarked resources:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch bookmarked resources',
          variant: 'destructive',
        });
      } finally {
        setBookmarksLoading(false);
      }
    }, [toast]);
    
    // Then your original useEffect stays almost the same
    useEffect(() => {
      if (activeTab === 'bookmark') {
        fetchBookmarkedResources();
      }
    }, [activeTab, fetchBookmarkedResources]);


    // Function to toggle bookmark via API
    const handleBookmark = async (id: string) => {
      console.log('Bookmark clicked for ID:', id);
      await toggleBookmark(id);
    };
    
    // Then, update the toggleBookmark function to properly update both arrays
    const toggleBookmark = async (resourceId: string) => {
      try {
        const token = localStorage.getItem("token");
        // Call the bookmark API endpoint
        const response = await apiClient.post(`/resources/${resourceId}/bookmark`);
        console.log('Bookmark response:', response);
        
        // Update resources array
        setResources(prevResources => 
          prevResources.map(resource => 
            resource.id === resourceId ? {...resource, isBookmarked: !resource.isBookmarked} : resource
          )
        );
        
        // Update recommended array
        setRecommended(prevRecommended => 
          prevRecommended.map(item => 
            item.id === resourceId ? {...item, isBookmarked: !item.isBookmarked} : item
          )
        );
        
        // If we're in bookmark tab, we might need to remove the item
        if (activeTab === 'bookmark') {
          // Find the resource to check if it's currently bookmarked
          const resource = resources.find(r => r.id === resourceId) || 
                          recommended.find(r => r.id === resourceId);
                          
          if (resource && resource.isBookmarked) {
            // If it's currently bookmarked, it will be removed, so update the list
            setBookmarkedResources(prev => prev.filter(r => r.id !== resourceId));
          } else {
            // It's being bookmarked, so we might need to fetch the updated list
            fetchBookmarkedResources();
          }
        }
        
        toast({
          title: 'Success',
          description: 'Bookmark status updated successfully',
          variant: 'default',
        });
      } catch (error) {
        console.error('Error toggling bookmark:', error);
        toast({
          title: 'Error',
          description: 'Failed to update bookmark status',
          variant: 'destructive',
        });
      }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setActiveTab(tab);
    };
    
    const handleFilterSelect = (filter: string) => {
        setSelectedFilter(filter);
        setShowFilterBy(false);
    };

    const handleSortSelect = (sortOption: string) => {
        if (sortOption === 'Latest') {
            const sorted = [...resources].sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });
            setResources(sorted);
        } else if (sortOption === 'Most viewed') {
            // Since we don't have view counts, we'll sort by ID as a placeholder
            const sorted = [...resources].sort((a, b) => {
              return a.id.localeCompare(b.id);
            });
            setResources(sorted);
        }
        setShowSortBy(false);
    };

    const filterTypes: string[] = ['WEBINAR', 'VIDEO', 'ARTICLE', 'AUDIO', 'PODCAST'];
    const sortOptions: string[] = ['Latest', 'Most viewed'];

    const filteredResources = Array.isArray(resources) ? resources.filter(resource => {
        if (activeTab === 'bookmark' && !resource.isBookmarked) return false;
        
        if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
    
        if (selectedFilter && resource.type && resource.type.toLowerCase() !== selectedFilter.toLowerCase()) {
            return false;
        }
        
        return true;
    }) : [];

    const openResourceModal = async (resource: Resource) => {
      try {
          setDetailsLoading(true);
          setSelectedResource(resource); // Set selected resource immediately for UI feedback
          
          const response = await apiClient.get(`/resources/content/${resource.id}`);

          // Handle response based on structure
          const detailData = response.data ? response.data : response;
          
          // Set the detailed data received from API
          setResourceDetails(detailData);
          console.log('Resource details:', detailData);
          
      } catch (error) {
          console.error('Error fetching resource details:', error);
          toast({
              title: 'Error',
              description: 'Failed to fetch resource details. Please try again later.',
              variant: 'destructive',
          });
          // Keep the basic resource data as fallback
      } finally {
          setDetailsLoading(false);
      }
    };

    // Function to close resource details modal
    const closeResourceModal = () => {
      setSelectedResource(null);
      setResourceDetails(null); // Clear the detailed data when closing
    };

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

    // Loading state component
    const LoadingState = () => (
        <div className="flex-grow flex items-center justify-center mt-40">
            <div className="text-center p-16">
                <h2 className="text-xl font-bold text-gray-800">
                    Loading resources...
                </h2>
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
            {resource.type === 'WEBINAR' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/rec.png" width={38} height={34} alt="rec-icon" />
              </div>
            )}
             {resource.type === 'PODCAST' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/rec.png" width={38} height={34} alt="rec-icon" />
              </div>
            )}
            {resource.type === 'ARTICLE' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/PdfIcon.png" width={38} height={34} alt="pdf-icon" />
              </div>
            )}
            {resource.type === 'VIDEO' && (
              <div className="w-12 h-12 flex items-center justify-center">
                <Image src="/Utube.png" width={38} height={30} alt="video-icon" />
              </div>
            )}
            {resource.type === 'AUDIO' && (
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
            <p className="text-sm text-primary font-semibold mb-2">
              {resource.type ? `${resource.type.charAt(0).toUpperCase() + resource.type.slice(1).toLowerCase()}` : 'Resource'}
            </p>

            <div className="flex items-center mb-2">
              {resource.isPremium ? (
                <span className="text-green-500 mr-2 text-sm flex items-center">
                  <CircleDollarSign className="w-4 h-4 mr-1" />
                  Premium
                </span>
              ) : (
                <span className="text-gray-600 mr-2 text-sm flex items-center">
                  <SquareLibrary className="w-4 h-4 mr-1"/>
                  Free
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-700 mb-3">
            <span>{resource.date || new Date(resource.createdAt || '').toLocaleDateString()}</span>
          </div>
          <button 
          className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors"
          onClick={() => openResourceModal(resource)}>
            View Details
          </button>
        </div>
      </div>
    );

    const renderResourceTab = () => {
        if (loading) {
            return <LoadingState />;
        }
        
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

    const renderRecommendedTab = () => {
        if (loading) {
            return <LoadingState />;
        }
        
        // Filter recommended resources based on search and filters
        const filteredRecommended = Array.isArray(recommended) ? recommended.filter(rec => {
            // Filter based on search query
            if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            
            // Filter based on selected filter
            if (selectedFilter && rec.type && rec.type.toLowerCase() !== selectedFilter.toLowerCase()) {
                return false;
            }
            
            return true;
        }) : [];
        
        if (filteredRecommended.length === 0) {
            return <EmptyState />;
        }
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRecommended.map(rec => (
                    <ResourceCard key={rec.id} resource={rec} />
                ))}
            </div>
        );
    };

    const renderBookmarkTab = () => {
      // Show loading state while fetching bookmarks
      if (bookmarksLoading) {
          return <LoadingState />;
      }
      
      // Apply filters to bookmarked resources
      const filteredBookmarks = Array.isArray(bookmarkedResources) ? bookmarkedResources.filter(resource => {
          // Filter based on search query
          if (searchQuery && !resource.title.toLowerCase().includes(searchQuery.toLowerCase())) {
              return false;
          }
          
          // Filter based on selected filter type if one is selected
          if (selectedFilter && resource.type && resource.type.toLowerCase() !== selectedFilter.toLowerCase()) {
              return false;
          }
          
          return true;
      }) : [];
      
      // Show empty state if no bookmarks found or all filtered out
      if (filteredBookmarks.length === 0) {
          return <EmptyState />;
      }
  
      // Render the bookmarked resources grid
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredBookmarks.map(resource => (
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
                <div className="relative w-full sm:w-1/2"></div>    
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
                                            {filter.charAt(0) + filter.slice(1).toLowerCase()}
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

            {activeTab === 'resource' && renderResourceTab()}
            {activeTab === 'recommended' && renderRecommendedTab()}
            {activeTab === 'bookmark' && renderBookmarkTab()}

            {selectedResource && (
              <ResourceDetailsModal 
                  resource={resourceDetails || selectedResource} // Use detailed data if available, otherwise use basic data
                  isLoading={detailsLoading}
                  onClose={closeResourceModal} 
              />
            )}
        </div>
    );
}

export default ResourcePage;