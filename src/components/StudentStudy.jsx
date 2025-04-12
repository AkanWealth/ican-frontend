"use client";

import React from "react";
import Studenttile from "./genui/Studenttile";
import { studentMaterials } from "@/lib/studentdata";  
// import { Pagination } from "../components/Pagination";

function StudentStudy() {
  // State for active category tab and current pagination page
  //   const [activeTab, setActiveTab] = useState("");
  //   const [currentPage, setCurrentPage] = useState(1);

  //   // Reset pagination to the first page when the active tab changes
  //   useEffect(() => {
  //     setCurrentPage(1);
  //   }, [activeTab]);

  //   // Number of posts to display per page
  //   const postsPerPage = 6;

  //   const handleTabChange = (tab: string) => {
  //     setActiveTab(tab);
  //     setCurrentPage(1);
  //   };

  //   // Compute the posts to display on the current page
  //   const paginatedPosts = filteredPosts.slice(
  //     (currentPage - 1) * postsPerPage,
  //     currentPage * postsPerPage
  //   );
  var raw = studentMaterials.slice(0, 9);

  return (
    <div className=" p-4  sm:p-20 lg:px-40 w-full flex flex-col gap-12 justify-start items-start ">
      <h3 className="text-primary text-3xl sm:text-4xl font-bold font-mono ">
        Student Study Pack
      </h3>
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        aria-label="Downloadable Contents"
      >
         {raw.map((post) => (
          <Studenttile
            key={post.id}
            imageUrl={post.imageUrl}
            title={post.title}
            fileType="PDF"
            downloadLink={post.downloadLink}
          />
        ))}
      </section>
    </div>
  );
}

export default StudentStudy;
