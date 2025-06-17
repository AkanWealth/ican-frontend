"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { GalleryItem } from "@/libs/types";

// Create a combined type that accounts for both structures
type GalleryItemWithFallback = Partial<GalleryItem> & {
  id: number;
  imgurl?: string;
  title?: string;
  images?: string[];
  name?: string;
};

interface ImageOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItem: GalleryItemWithFallback;
  currentImageIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  isOpen,
  onClose,
  galleryItem,
  currentImageIndex,
  onNext,
  onPrevious,
}) => {
  if (!isOpen) return null;

  // Handle both array of images and single image formats
  const images = galleryItem.images || [galleryItem.imgurl!];
  const totalImages = images.length;
  const currentImage = images[currentImageIndex];
  const imageTitle = galleryItem.name || "Gallery image";

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-6xl mx-auto">
        {/* Close button for mobile - positioned at top */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 text-white bg-black/40 rounded-full p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Image Container with Navigation */}
        <div className="relative h-[85vh] w-full">
          {/* Image */}
          <div className="h-full w-full flex items-center justify-center">
            <Image
              src={currentImage}
              alt={imageTitle}
              className="object-contain h-full w-full"
              fill={true}
              sizes="100vw"
              priority
            />
          </div>

          {/* Navigation Buttons - Made more visible/accessible on mobile */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between items-center px-2 sm:px-4 py-2">
            {currentImageIndex > 0 && (
              <button
                onClick={onPrevious}
                className="text-white hover:text-white transition-colors bg-black/40 p-2 rounded-full"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            {currentImageIndex < totalImages - 1 && (
              <button
                onClick={onNext}
                className="text-white hover:text-white transition-colors bg-black/40 p-2 rounded-full ml-auto"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Info Bar - Made more compact on mobile */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="text-xs sm:text-sm mr-2">
                  {currentImageIndex + 1}/{totalImages}
                </span>
                <span className="font-medium text-sm sm:text-base truncate max-w-[75vw]">
                  {imageTitle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Gallery() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<GalleryItemWithFallback | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/gallery`);
        setGallery(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError("Failed to load gallery items");
        setLoading(false);
      }
    };
    fetchGalleryItems();
  }, []);

  // Fallback to default items if API fails

  // Use type assertion to handle the combination of API and fallback data
  const displayItems =
    gallery.length > 0
      ? (gallery as GalleryItemWithFallback[])
      : [];

  const handleNext = () => {
    if (selectedGalleryItem) {
      const images = selectedGalleryItem.images || [
        selectedGalleryItem.imgurl!,
      ];
      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const openGalleryItem = (item: GalleryItemWithFallback) => {
    setSelectedGalleryItem(item);
    setCurrentImageIndex(0);
    setIsOverlayOpen(true);
  };

  // Group images into pairs for the carousel
  const pairedGalleryItems = displayItems.reduce<
    Array<Array<GalleryItemWithFallback>>
  >((acc, item, index) => {
    if (index % 2 === 0) {
      acc.push([item]);
    } else {
      acc[acc.length - 1].push(item);
    }
    return acc;
  }, []);

  return (
    <div className="w-full bg-green-50">
      <div className="py-6 sm:py-16 px-3 sm:px-8 lg:px-32">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-12">
          <div className="text-left mb-4 sm:mb-0 w-full">
            <h3 className="text-blue-900 font-bold text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">
              Our Gallery
            </h3>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Our journey in pictures. Explore highlights from past events and
              district gatherings.
            </p>
          </div>
          <Link href="/gallery" className="w-full sm:w-auto">
            <button className="bg-primary text-white px-4 py-2 rounded-full w-full sm:w-auto">
              View All
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {pairedGalleryItems.map((pair, pairIndex) => (
                  <CarouselItem key={pairIndex} className="pl-2 md:pl-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
                      {pair.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => openGalleryItem(item)}
                          className="relative group cursor-pointer overflow-hidden rounded-lg sm:rounded-2xl touch-manipulation"
                        >
                          <div className="aspect-[4/3] w-full">
                            <Image
                              fill={true}
                              src={item.images?.[0] || item.imgurl || ''}
                              alt={item.name || "Gallery image"}
                              className="w-full h-full object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                            <h4 className="text-white text-sm sm:text-xl font-semibold p-2 sm:p-6 truncate">
                              {item.name}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Mobile-friendly carousel controls */}
              <div className="mt-4 sm:mt-0">
                <CarouselPrevious className="absolute -left-3 top-1/2 -translate-y-1/2 bg-blue-900 hover:bg-blue-800 w-8 h-8 sm:w-12 sm:h-14 rounded-full sm:rounded-none sm:-left-16" />
                <CarouselNext className="absolute -right-3 top-1/2 -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white w-8 h-8 sm:w-12 sm:h-14 rounded-full sm:rounded-none sm:-right-16" />
              </div>

              {/* Mobile pagination indicators */}
              <div className="mt-4 flex justify-center space-x-2 sm:hidden">
                {pairedGalleryItems.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === 0 ? "bg-blue-900" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        )}
      </div>

      {isOverlayOpen && selectedGalleryItem && (
        <ImageOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          galleryItem={selectedGalleryItem}
          currentImageIndex={currentImageIndex}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}

export default Gallery;
