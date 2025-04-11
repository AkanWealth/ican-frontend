"use client";

import React from "react";
import Heroimg from "@/components/homecomps/Heroimg"; // Import Heroimg component for the page hero section
import BlogList from "@/components/homecontent/BlogListSection"; // Import BlogList component to display the list of blogs
import Link from "next/link";

// Main Blog page component
function Blog() {
  return (
    <div>
      {/** Hero section: Display a hero image with a title, subtitle, and action buttons */}
      <Heroimg
        toggle={false} // Prop to toggle specific features (assumed functionality)
        maintxt={"Blog"} // Main title for the hero section
        imageUrl="/bloghero.png" // Path to the hero image
        subtxt={
          "Stay informed with insightful articles and get the latest updates on district activities and ICAN news, all in one place." // Subtitle for the hero section
        }
      >
        {/** Buttons for membership and more information */}
        <div className="flex gap-12 flex-row justify-between mt-4">
          {/** Button to become a member */}

          <Link href={"/sign-up"}>
            <button className="text-white rounded-full bg-secondary py-3 px-8 w-fit hover:bg-green-900">
              Become a Member
            </button>
          </Link>
          {/** Button for additional information */}
          <Link href={"/membership"}>
            <button className="outline-1 outline-white text-primary rounded-full bg-blue-100 hover:bg-blue-500 hover:text-white py-3 px-8 w-fit">
              Learn more
            </button>
          </Link>
        </div>
      </Heroimg>

      {/** Blog list section: Display the list of blogs */}
      <BlogList />
    </div>
  );
}

export default Blog;
