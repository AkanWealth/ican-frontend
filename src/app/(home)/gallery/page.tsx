"use client"

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { galleryItems } from "@/lib/gallerydata"; // Import the gallery items data

function MainGalleryPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center bg-white mt-20 2xl:container mx-auto">
      <section className="p-4 sm:p-20 lg:px-40">
        <h1 className="text-4xl font-bold mb-8">Gallery Collection</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => router.push(`/gallery/${item.id}`)}
            >
              <Image
                src={item.imageUrl}
                width={300}
                height={200}
                alt={item.title}
                className="w-full h-auto rounded-lg"
              />
              <h2 className="text-xl font-semibold mt-4">{item.title}</h2>
              <time className="text-base text-gray-500">{item.date}</time>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MainGalleryPage;
