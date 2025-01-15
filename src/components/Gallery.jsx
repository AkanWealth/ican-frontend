import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ImageOverlay = ({ isOpen, onClose, currentImage, totalImages, currentIndex, onNext, onPrevious }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="relative max-w-6xl mx-auto">
        {/* Image Container with Navigation */}
        <div className="relative">
          {/* Image */}
          <img
            src={currentImage.imgurl}
            alt={currentImage.title}
            className="max-h-[85vh] w-auto"
          />
          
          {/* Top Navigation Bar */}
          <div className="absolute top-[277px] left-0 right-0 flex justify-between items-center px-4 py-2">
            <button
              onClick={onPrevious}
              className="text-white hover:text-white transition-colors"
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={onNext}
              className="text-white hover:text-white transition-colors"
              disabled={currentIndex === totalImages - 1}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>

          {/* Bottom Info Bar - Width Matches Image */}
          <div className="absolute bottom-0 left-0 right-0 bg-white font-semibold p-4">
            <div className="flex items-center justify-between">
              <div className="text-black text-sm">
                Image {currentIndex + 1} of {totalImages}
              </div>
              <button
                onClick={onClose}
                className="text-black hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Gallery() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryItems = [
    { 
      id: 1, 
      title: "54th ICAN Annual Accountant's Conference", 
      imgurl: "/Gallery1.jpg" 
    },
    { 
      id: 2, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery2.jpg" 
    },
    { 
      id: 3, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery3.jpg" 
    },
    { 
      id: 4, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery4.jpg" 
    },
    { 
      id: 5, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery5.jpg" 
    },
    { 
      id: 6, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery6.jpg" 
    },
    { 
      id: 7, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery7.jpg" 
    },
    { 
      id: 8, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery8.jpg" 
    },
    { 
      id: 9, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery9.jpg" 
    },
    { 
      id: 10, 
      title: "ICAN Surulere District Society Team Photos", 
      imgurl: "/Gallery10.jpg" 
    },
    
  ];

  const handleNext = () => {
    if (currentImageIndex < galleryItems.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Group images into pairs for the carousel
  const pairedGalleryItems = galleryItems.reduce((acc, item, index) => {
    if (index % 2 === 0) {
      acc.push([item]);
    } else {
      acc[acc.length - 1].push(item);
    }
    return acc;
  }, []);

  return (
    <div className="w-full bg-green-50">
      <div className="py-16 px-4 sm:px-8 lg:px-32">
        <div className="text-center mb-12">
          <h3 className="text-blue-900 font-bold text-4xl mb-4">
            Our Gallery
          </h3>
          <p className="text-gray-600 text-lg">
            Our journey in pictures. Explore highlights from past events and
            district gatherings.
          </p>
        </div>
        
        <div className="relative"> 
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {pairedGalleryItems.map((pair, pairIndex) => (
                <CarouselItem key={pairIndex} className="pl-2 md:pl-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {pair.map((item, index) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setCurrentImageIndex(pairIndex * 2 + index);
                          setIsOverlayOpen(true);
                        }}
                        className="relative group cursor-pointer overflow-hidden rounded-2xl"
                      >
                        <div className="aspect-[4/3] w-full">
                          <img
                            src={item.imgurl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <h4 className="text-white text-xl font-semibold p-6">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-16 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 w-12 h-14 rounded-none" />
            <CarouselNext className="absolute -right-16 top-1/2 -translate-y-1/2 bg-blue-900 hover:bg-blue-800 text-white w-12 h-14 rounded-none" />
          </Carousel>
        </div>
      </div>

      {isOverlayOpen && (
        <ImageOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          currentImage={galleryItems[currentImageIndex]}
          totalImages={galleryItems.length}
          currentIndex={currentImageIndex}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}

export default Gallery;