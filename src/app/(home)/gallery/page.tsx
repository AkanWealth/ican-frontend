"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Heroimg from "@/components/homecomps/Heroimg";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { useToast } from "@/hooks/use-toast";
import { GalleryItem } from "@/libs/types";

function MainGalleryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/gallery`);
        setGallery(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        toast({
          title: "Error fetching gallery items",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };
    fetchGalleryItems();
  }, [toast]);

  return (
    <main className="flex w-full flex-col items-center bg-white mt-16 sm:mt-20">
      <Heroimg
        maintxt="Visual stories from our events and activities."
        imageUrl="/galleryhero.png"
      />
      <section className="w-full px-4 py-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8">
          Gallery Collection
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px] md:min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {Array.isArray(gallery) &&
              gallery.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  onClick={() => router.push(`/gallery/${item.id}`)}
                >
                  <div className="relative w-full aspect-[3/2]">
                    <Image
                      src={item.images?.[0] || "/placeholder-image.png"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h2 className="text-lg sm:text-xl font-semibold mt-1">
                      {item.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MainGalleryPage;
