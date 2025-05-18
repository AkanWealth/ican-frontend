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
    <main className="flex flex-col items-center bg-white mt-20 2xl:container mx-auto">
      <Heroimg
        maintxt="Visual stories from our events and activities."
        imageUrl="/galleryhero.png"
      />
      <section className="p-4 sm:p-20 lg:px-40">
        <h1 className=" text-3xl sm:text-4xl font-bold mb-8">
          Gallery Collection
        </h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(gallery) && gallery.map((item) => (
              <div
                key={item.id}
                className="cursor-pointer"
                onClick={() => router.push(`/gallery/${item.id}`)}
              >
                <Image
                  src={item.images?.[0] || '/placeholder-image.png'}
                  width={300}
                  height={200}
                  alt={item.name}
                  className="w-full h-[350px] rounded-lg"
                />
                <h2 className="text-xl font-semibold mt-4">{item.name}</h2>
                <time className="text-base text-gray-500">
                  {item.createdAt}
                </time>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MainGalleryPage;
