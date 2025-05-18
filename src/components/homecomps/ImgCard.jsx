import React from "react";
import Image from "next/image";

const Imgcard = ({ title, imgurl }) => {
  return (
    <div className="relative overflow-hidden rounded-lg group">
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full min-w-[300px] sm:min-w-[400px]">
        <Image
          src={imgurl}
          alt={title}
          height={200}
          width={200}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Title overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
        <h4 className="text-white font-medium text-lg">{title}</h4>
      </div>
    </div>
  );
};

export default Imgcard;
