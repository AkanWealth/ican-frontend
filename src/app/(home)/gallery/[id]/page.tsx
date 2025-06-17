"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import GalleryCard from "@/components/homecontent/GalleryCard"; // Assuming you have a GalleryCard component

import { GalleryItem } from "@/libs/types";
import { BASE_API_URL } from "@/utils/setter";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

import { motion } from "framer-motion";

import { handleReadMore } from "@/lib/utils";
import CommentSection from "@/components/homecontent/CommentSection";

export default function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>; // The `params` prop represents the dynamic URL parameter, specifically the `id` of the gallery item.
}) {
  const { toast } = useToast();
  const router = useRouter();

  // Extract the ID at the component level
  const { id } = use(params);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  const [galleryItem, setGalleryItem] = useState<GalleryItem>({
    id: "",
    name: "",
    images: [],
    videos: [],
    createdBy: "",
    createdAt: "",
    status: "inactive",
    user: {
      firstname: "",
      surname: "",
      email: "",
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryItem = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/gallery/${id}`);
        setGalleryItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gallery item:", error);
        setLoading(false);
        toast({
          title: "Error fetching gallery item",
          description: "Please try again later",
          variant: "destructive",
        });
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          notFound();
        }
      }
    };
    fetchGalleryItem();
  }, [id, toast]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/gallery`);
        setGallery(response.data.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    fetchGallery();
  }, []);

  const relatedItems = Array.isArray(gallery) ? gallery.slice(0, 2) : [];

  return (
    <main className="flex flex-col items-center bg-white  mt-16    mx-auto">
      {/** First Section: Main Gallery Content */}
      <section className="p-4  w-full sm:p-20   border-b-2 border-gray-200">
        <article className="flex flex-col max-w-full">
          {/** Back Button */}

          {/** Gallery Title */}
          <h1 className=" flex justify-between items-center gap-4 mt-4  text-3xl sm:text-4xl font-bold leading-[50px] text-neutral-800 max-md:max-w-full">
            <div
              className="flex justify-center items-center px-2 w-8 h-8 bg-blue-900 min-h-[32px] rounded-[999px] cursor-pointer"
              onClick={() => router.back()} // Go back to the previous page
            >
              <FaArrowLeft className="fill-white h-6 w-6" />
            </div>
            {galleryItem.name}
          </h1>

          {/** Date */}
          <p className="mt-4 text-base font-semibold text-stone-500 max-md:max-w-full">
            {new Date(galleryItem.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {/** Gallery Media Section */}
          <section className="flex flex-col gap-8 mt-8">
            {/* Images Section */}
            {loading ? (
              <div className="flex justify-center items-center h-64 w-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
              </div>
            ) : galleryItem.images.length > 0 ? (
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl font-bold text-blue-900 mb-4"
                >
                  Gallery Images
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItem.images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative aspect-square w-full hover:scale-105 transition-transform duration-300"
                    >
                      <Image
                        src={image}
                        fill
                        alt={`${galleryItem.name} - Image ${index + 1}`}
                        className="object-cover rounded-lg"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No images available for this gallery
              </div>
            )}
          </section>
        </article>
      </section>

      {/* * Second Section: Comment Section
      <section className="mr-auto p-4 sm:p-20 lg:px-40">
        <CommentSection galleryItemId={item.id} />
      </section> */}

      {/** Third Section: Related Gallery Items */}
      <section className="flex flex-col w-full gap-12 p-4 sm:p-20 lg:px-40 sm:bg-[#E0F5E6]">
        <h2 className="text-3xl font-bold text-blue-900">
          Related Gallery Items
        </h2>

        {/** Display Related Gallery Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {relatedItems.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => router.push(`/gallery/${item.id}`)}
            >
              <Image
                src={item.images[0]}
                width={300}
                height={200}
                alt={item.name}
                className="w-full h-[350px] rounded-lg"
              />
              <h2 className="text-xl font-semibold mt-4">{item.name}</h2>
              <p className="text-base text-gray-500">{new Date(item.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
