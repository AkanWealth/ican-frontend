import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GalleryItem } from "@/lib/gallerydata"; // Import the GalleryItem type
import CommentSection from "@/components/CommentSection"; // Import the CommentSection component

function GalleryCard({ item, onReadMore }) {
  const router = useRouter();

  return (
    <div
      className="relative w-full max-w-md cursor-pointer"
      onClick={onReadMore}
    >
      <h6 className="absolute p-4 sm:p-12 bottom-0 z-20 text-left font-bold drop-shadow-2xl text-2xl font-mono text-white">
        {item.title}
      </h6>
      <Image
        src={item.imageUrl}
        width={0}
        height={0}
        sizes="100vw"
        alt={item.title}
        className="h-auto w-full z-10 rounded-3xl relative"
      />
      <CommentSection galleryItemId={item.id} /> {/* Add CommentSection */}
    </div>
  );
}

GalleryCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onReadMore: PropTypes.func.isRequired,
};

export default GalleryCard;
