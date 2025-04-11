'use client';
import React from 'react';
import Image from 'next/image';
import { Bookmark, CircleDollarSign, SquareLibrary,CircleX } from 'lucide-react';
import { FaSpotify } from 'react-icons/fa';

interface Resource {
    id: number;
    type: string;
    title: string;
    date: string;
    isPremium: boolean;
    isBookmarked: boolean;
    icon: 'REC' | 'PDF' | 'VIDEO' | 'AUDIO';
    description?: string;
    duration?: string;
}

interface ResourceDetailsModalProps {
    resource: Resource;
    onClose: () => void;
}

const ResourceDetailsModal: React.FC<ResourceDetailsModalProps> = ({ resource, onClose }) => {
    if (!resource) return null;

    const renderModalContent = () => {
        switch(resource.icon) {
            case 'REC':
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
                            {/* <span>{resource.duration}</span> */}
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
            case 'VIDEO':
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
                            {/* <span>{resource.duration}</span> */}
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
            case 'PDF':
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
                            {/* <span>{resource.duration}</span> */}
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
                                Download PDF
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
                            {/* <span>{resource.duration}</span> */}
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
                return null;
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