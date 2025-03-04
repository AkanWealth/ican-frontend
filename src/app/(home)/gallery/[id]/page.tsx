"use client";

import { use } from "react";
import Image from "next/image";
import { galleryItems } from "@/lib/gallerydata"; // Assuming you have a data file for gallery items
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import GalleryCard from "@/components/GalleryCard"; // Assuming you have a GalleryCard component
// import { shuffleArray } from "@/lib/utils";
// import Getin from "@/components/Getin";
import { handleReadMore } from "@/lib/utils";
import CommentSection from "@/components/CommentSection";

export default function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>; // The `params` prop represents the dynamic URL parameter, specifically the `id` of the gallery item.
}) {
  function shuffleArray<T>(array: T[]): T[] {
    return array

      .map((item) => ({
        item, // Wrap each element in an object with the original item.

        sort: Math.random(), // Add a random value for sorting.
      }))

      .sort((a, b) => a.sort - b.sort) // Sort the array based on the random `sort` value.

      .map(({ item }) => item); // Extract and return the shuffled items.
  }

  const router = useRouter(); // Hook to navigate programmatically

  // Destructure and resolve the promise to extract `id`
  const { id } = use(params);

  // Find the specific item from the galleryItems array by matching the `id`
  const item = galleryItems.find((p) => p.id === id);

  // If the item is not found, trigger a 404 not found page
  if (!item) {
    notFound();
  }

  // Find related gallery items based on the same category, excluding the current item
  // Shuffle the related items and slice the first 2 for display
  const relatedItems = shuffleArray(
    galleryItems.filter((p) => p.category === item.category && p.id !== id)
  ).slice(0, 2);

  return (
    <main className="flex flex-col items-center bg-white  mt-16 2xl:container mx-auto">
      {/** First Section: Main Gallery Content */}
      <section className="p-4 sm:p-20 lg:px-40 border-b-2 border-gray-200">
        <article className="flex flex-col max-w-full">
          {/** Back Button */}
          <div
            className="flex justify-center items-center px-2 w-8 h-8 bg-blue-900 min-h-[32px] rounded-[999px] cursor-pointer"
            onClick={() => router.back()} // Go back to the previous page
          >
            <FaArrowLeft className="fill-white h-6 w-6" />
          </div>

          {/** Gallery Title */}
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-[50px] text-neutral-800 max-md:max-w-full">
            {item.title}
          </h1>

          {/** Date */}
          <time className="mt-4 text-base font-semibold text-stone-500 max-md:max-w-full">
            {item.date}
          </time>

          {/** Gallery Image */}
          {/* <Image
            loading="lazy"
            width={100}
            height={100}
            src={item.imageUrl}
            className="object-cover mt-12 max-w-full rounded-2xl aspect-[2.27] w-full max-md:mt-10"
            alt={item.title} // Alt text for the image
          /> */}

          {/** Gallery Content */}
          <section className="flex flex-col items-start mt-12 max-w-full text-base leading-6 text-neutral-800 max-md:mt-10 mx-auto">
            <h2 className="text-xl font-semibold mb-4">
              {item.galleryContent.subtitle}
            </h2>
            <p>{item.galleryContent.content}</p>
          </section>

          {/** Additional Gallery Images */}
          <section className="flex flex-wrap gap-4 mt-8">
            {item.galleryContent.galleryImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                width={200}
                height={150}
                alt={`${item.title} - ${index + 1}`}
                className="object-cover rounded-lg"
              />
            ))}
          </section>
        </article>
      </section>

      {/** Second Section: Comment Section */}
      <section className="mr-auto p-4 sm:p-20 lg:px-40">
        <CommentSection galleryItemId={item.id} />
      </section>

      {/** Third Section: Related Gallery Items */}
      <section className="flex flex-col w-full gap-12 p-4 sm:p-20 lg:px-40 sm:bg-[#E0F5E6]">
        <h2 className="text-3xl font-bold text-blue-900">
          Related Gallery Items
        </h2>

        {/** Display Related Gallery Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {relatedItems.map((item) => (
            <GalleryCard
              key={item.id} // Unique key for each related gallery card
              item={item} // Pass item data as a prop to the GalleryCard component
              onReadMore={() => handleReadMore(router, item.id)} // Navigate to the related item
            />
          ))}
        </div>
      </section>
    </main>
  );
}
