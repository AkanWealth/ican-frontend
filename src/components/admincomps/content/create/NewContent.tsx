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
  mode?: "create" | "edit";
  contentCategory?: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

function NewContent({
  showModal,
  setShowModal,
  id,
  mode,
  contentCategory,
}: NewContentProps) {
  const [contentType, setContentType] = useState(contentCategory || "blog");
  const [currentMode, setCurrentMode] = useState(mode || "create");
  const [contentId, setContentId] = useState(id || "");

  const handleClose = () => {
    setShowModal(false);
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto py-4">
      <div className="flex flex-col w-full max-w-3xl max-h-[90vh] px-6 py-4 rounded-xl gap-4 bg-white my-auto mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4">
          {/* Title section with close button */}
          <div className="flex items-center justify-between w-full">
            <h3 className="text-2xl font-bold font-mono text-neutral-900">
              Add New Content
            </h3>
            <button
              className="fill-neutral-800 rounded-full p-2 hover:bg-gray-100"
              onClick={() => setShowModal(false)}
            >
              <MdClose className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-neutral-700">
            Fill in the required details to create new content for the selected
            category
          </p>

          {/* Content Type Section */}
          <div className="w-full">
            <InputEle
              label="Content Type"
              type="select"
              id="contentType"
              value={contentType}
              disabled={mode === "edit"}
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

            <p className="text-xs text-neutral-700 mt-1">
              Choose the type of content you want to create. The required fields
              will adjust accordingly.
            </p>
          </div>
        </div>
        <hr className="my-1" />
        {/* Variable display body for content creation */}
        <div className="overflow-y-auto pr-1 flex-1">
          <h3 className="flex flex-row items-center justify-start text-lg font-bold font-mono text-neutral-900 sticky top-0 bg-white py-2">
            <MdOutlineLibraryBooks className="w-4 h-4 mr-3" /> Add New{" "}
            {contentType}
          </h3>
          <div className="pb-4">
            {contentType === "adverts" && (
              <AdvertEdit mode={currentMode} id={contentId} />
            )}
            {contentType === "blog" && (
              <BlogEdit mode={currentMode} id={contentId} />
            )}
            {contentType === "gallery" && (
              <GalleryEdit mode={currentMode} id={contentId} />
            )}
            {contentType === "resources" && (
              <ResourceEdit mode={currentMode} id={contentId} />
            )}
            {contentType === "technical" && (
              <TechnicalEdit mode={currentMode} id={contentId} />
            )}
            {contentType === "student" && (
              <StudentEdit mode={currentMode} id={contentId} />
            )}
            {contentType === "faq" && (
              <FaqEdit mode={currentMode} id={contentId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewContent;
