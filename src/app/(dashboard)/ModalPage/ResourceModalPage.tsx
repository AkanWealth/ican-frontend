'use client';
import React from 'react';
import Image from 'next/image';
import { Bookmark, CircleDollarSign, SquareLibrary, CircleX, Loader2 } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';

interface Resource {
    id: number;
    type: string;
    title: string;
    date: string;
    isPremium: boolean;
    isBookmarked: boolean;
    icon: 'WEBINAR' | 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'PODCAST';
    description?: string;
    duration?: string;
    content?: string; // Full content from API
    url?: string; // URL for external resources
    attachments?: Array<{name: string, url: string}>; // For downloadable resources
}

interface ResourceDetailsModalProps {
    resource: any; // The resource with full details
    isLoading?: boolean;
    onClose: () => void;
}

const ResourceDetailsModal: React.FC<ResourceDetailsModalProps> = ({ resource, isLoading = false, onClose }) => {
    if (!resource) return null;

    // Loading state
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white w-full max-w-2xl rounded-lg p-8">
                    <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                        <p className="text-lg font-medium">Loading resource details...</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderModalContent = () => {
        // First check if we have detailed content from the API
        if (resource.content) {
            return (
                <div className="p-6">
                    {/* Content header */}
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className='text-primary text-sm font-semibold'>{resource.type}</p>
                        </div>
                        <div className="flex items-center">
                            {resource.isBookmarked ? (
                                <span className="text-green-500 mr-2 text-sm flex items-center">
                                    <Bookmark className="w-4 h-4 mr-1" />
                                </span>
                            ) : (
                                <span className="text-gray-600 mr-2 text-sm flex items-center">
                                    <Bookmark className="w-4 h-4 mr-1"/>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-2">
                        <h2 className="text-xl font-bold">{resource.title}</h2>
                    </div>

                    {/* Metadata */}
                    <div className="mb-4">
                        <div className="flex items-center mb-2 text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                            {resource.duration && <span className="text-xs">{resource.duration}</span>}
                        </div>
                        <div className="flex items-center">
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

                    {/* Main content from API */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <div className="text-sm text-gray-800">
                            {resource.description && <p className="mb-4">{resource.description}</p>}
                            
                            {/* Render full content if available */}
                            {resource.content && (
                                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: resource.content }} />
                            )}
                        </div>
                    </div>

                    {/* Attachments */}
                    {resource.attachments && resource.attachments.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-2">Attachments</h3>
                            <ul className="space-y-2">
                                {resource.attachments.map((attachment: any, idx: any) => (
                                    <li key={idx} className="text-sm">
                                        <a 
                                            href={attachment.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {attachment.name || `Attachment ${idx + 1}`}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex space-x-4">
                        {resource.url && (
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors"
                            >
                                Open Resource
                            </a>
                        )}
                        
                        {resource.downloadUrl && (
                            <a
                                href={resource.downloadUrl}
                                download
                                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors"
                            >
                                Download
                            </a>
                        )}
                    </div>
                </div>
            );
        }

        // Fallback to basic rendering based on resource type
        switch(resource.type) {
            case 'WEBINAR':
                return (
                    <div className="p-6">
                        <div className="relative w-full h-80 mb-6">
                            <Image 
                                src="/ResourceWebinar.png" 
                                alt={resource.title} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-lg"
                            />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="">
                                <p className='text-primary text-sm font-semibold'>{resource.type}</p>
                            </div>
                            <div className="flex items-center">
                                {resource.isBookmarked ? (
                                    <span className="text-green-500 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1" />
                                    </span>
                                ) : (
                                    <span className="text-gray-600 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1"/>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold">{resource.title}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-800">{resource.description}</p>
                        </div>
                        <div className="mb-2 flex items-center text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                        </div>
                        <div className="flex items-center">
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
                        <div className="mt-4 flex space-x-4">
                            <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
                                Download video
                            </button>
                        </div>
                    </div>
                );
            case 'PODCAST':
                // Podcast content rendering
                // Similar to the existing code for other resource types
                return (
                    <div className="p-6">
                        <div className="relative w-full h-80 mb-6">
                            <Image 
                                src="/ResourceWebinar.png" 
                                alt={resource.title} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-lg"
                            />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="">
                                <p className='text-primary text-sm font-semibold'>{resource.type}</p>
                            </div>
                            <div className="flex items-center">
                                {resource.isBookmarked ? (
                                    <span className="text-green-500 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1" />
                                    </span>
                                ) : (
                                    <span className="text-gray-600 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1"/>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold">{resource.title}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-800">{resource.description}</p>
                        </div>
                        <div className="mb-2 flex items-center text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                        </div>
                        <div className="flex items-center">
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
                        <div className="mt-4 flex space-x-4">
                            <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
                                Download audio
                            </button>
                        </div>
                    </div>
                );
            case 'VIDEO':
                // Video content similar to the existing code
                return (
                    <div className="p-6">
                        <div className="relative w-full h-80 mb-6">
                            <Image 
                                src="/ResourceWebinar.png" 
                                alt={resource.title} 
                                layout="fill" 
                                objectFit="cover" 
                                className="rounded-lg"
                            />
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="">
                                <p className='text-primary text-sm font-semibold'>{resource.type}</p>
                            </div>
                            <div className="flex items-center">
                                {resource.isBookmarked ? (
                                    <span className="text-green-500 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1" />
                                    </span>
                                ) : (
                                    <span className="text-gray-600 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1"/>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold">{resource.title}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-800">{resource.description}</p>
                        </div>
                        <div className="mb-2 flex items-center text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                        </div>
                        <div className="flex items-center">
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
                        <div className="mt-4 flex space-x-4">
                            <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
                                Download video
                            </button>
                        </div>
                    </div>
                );
            case 'ARTICLE':
                return (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className='text-primary text-sm font-semibold'>{resource.type}</h2>
                            <div className="flex items-center">
                                {resource.isBookmarked ? (
                                    <span className="text-green-500 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1" />
                                    </span>
                                ) : (
                                    <span className="text-gray-600 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1"/>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold">{resource.title}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-800">{resource.description}</p>
                        </div>
                        <div className="mb-2 flex items-center text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                        </div>
                        <div className="flex items-center">
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
                        <div className="mt-4 flex space-x-4">
                            <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors">
                                Download ARTICLE
                            </button>
                        </div>
                    </div>
                );
            case 'AUDIO':
                return (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className='text-primary text-sm font-semibold'>{resource.type}</h2>
                            <div className="flex items-center">
                                {resource.isBookmarked ? (
                                    <span className="text-green-500 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1" />
                                    </span>
                                ) : (
                                    <span className="text-gray-600 mr-2 text-sm flex items-center">
                                        <Bookmark className="w-4 h-4 mr-1"/>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold">{resource.title}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-800">{resource.description}</p>
                        </div>
                        <div className="mb-2 flex items-center text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                        </div>
                        <div className="flex items-center">
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
                        <div className="mt-4 flex space-x-4">
                            <button className="bg-primary text-white px-2 py-2 rounded-full hover:bg-blue-800 transition-colors">
                                <span className="text-white mr-4 text-sm flex items-center">
                                    <FaSpotify className="w-4 h-4 mr-1" />
                                    Download on Spotify
                                </span>
                            </button>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className='text-primary text-sm font-semibold'>{resource.type || "Resource"}</h2>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-xl font-bold">{resource.title}</h2>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-800">{resource.description || "No description available."}</p>
                        </div>
                        <div className="mb-2 flex items-center text-gray-800">
                            <span className="text-xs mr-4">{resource.date}</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-lg max-h-[90vh] overflow-y-auto relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-600"
                >
                    <CircleX className="w-4 h-4" />
                </button>
                <div className='mt-6'>
                    {renderModalContent()}
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailsModal;