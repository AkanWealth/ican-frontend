import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";

import { MdClose, MdOutlineLibraryBooks } from "react-icons/md";

// Importing the edit components
import AdvertEdit from "./editcomps/AdvertEdit";
import BlogEdit from "./editcomps/BlogEdit";
import GalleryEdit from "./editcomps/GalleryEdit";
import TechnicalEdit from "./editcomps/TechnicalEdit";
import StudentEdit from "./editcomps/StudentEdit";
import FaqEdit from "./editcomps/FaqEdit";
import ResourceEdit from "./editcomps/ResourceEdit";

interface NewContentProps {
  id?: any;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

function NewContent({ showModal, setShowModal }: NewContentProps) {
  const [contentType, setContentType] = useState("blog");

  const handleClose = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 rounded-xl gap-4 bg-white">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-4">
          {/* Title section  */}
          <button
            className="ml-auto  fill-neutral-800 rounded-full px-3 py-1"
            onClick={() => setShowModal(false)}
          >
            <MdClose className="w-5 h-5 " />
          </button>
          <div>
            <h3 className="text-2xl font-bold font-mono text-neutral-900 ">
              Add New Content
            </h3>
            <p className=" text-sm text-neutral-700 ">
              Fill in the required details to create new content for the
              selected category
            </p>
          </div>

          {/* Content Type Section */}
          <div className="w-full">
            <InputEle
              label="Content Type"
              type="select"
              id="contentType"
              value={contentType}
              options={[
                { value: "adverts", label: "Adverts" },
                { value: "blog", label: "Blog" },
                { value: "resources", label: "Resources" },
                { value: "gallery", label: "Gallery" },
                { value: "technical", label: "Technical" },
                { value: "student", label: "Student" },
                { value: "faq", label: "Faq" },
              ]}
              onChange={(e) => setContentType(e.target.value)}
            />

            <p className="text-xs text-neutral-700">
              Choose the type of content you want to create. The required fields
              will adjust accordingly.
            </p>
          </div>
        </div>
        <hr />
        {/* Variable display body for content creation */}
        <div>
          <h3 className="flex flex-row items-center justify-start text-lg font-bold font-mono text-neutral-900">
            <MdOutlineLibraryBooks className="w-4 h-4 mr-3" /> Add New{" "}
            {contentType}
          </h3>
          <div>
            {contentType === "adverts" && <AdvertEdit mode="create" />}
            {contentType === "blog" && <BlogEdit mode="create" />}
            {contentType === "gallery" && <GalleryEdit mode="create" />}
            {contentType === "resources" && <ResourceEdit mode="create" />}
            {contentType === "technical" && <TechnicalEdit mode="create" />}
            {contentType === "student" && <StudentEdit mode="create" />}
            {contentType === "faq" && <FaqEdit mode="create" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewContent;
