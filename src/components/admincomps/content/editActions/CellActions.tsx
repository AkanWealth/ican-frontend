import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";
import UnpublishContent from "./UnpublishContent";
import DeleteContent from "./DeleteContent";

import PreviewAdvert from "../create/previewcomps/PreviewAdvert";
import PreviewBlog from "../create/previewcomps/PreviewBlog";
import PreviewGallery from "../create/previewcomps/PreviewGallery";
// import PreviewResource from "../create/previewcomps/PreviewResource";
import PreviewTechnical from "../create/previewcomps/PreviewTechnical";
import PreviewStudent from "../create/previewcomps/PreviewStudent";
import PreviewFaq from "../create/previewcomps/PreviewFaq";

import NewContent from "../create/NewContent";

interface CellProps {
  row: any; // Replace 'any' with the actual type of 'row'
  contentCategory: string;
}

const ActionsCell: React.FC<CellProps> = ({ row, contentCategory }) => {
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  var bucket = <></>;

  const handlePreview = () => {
    setShowPreviewModal(true);
    console.log("handlePreview called with contentCategory:", contentCategory);
    console.log("row data:", row.original);

    switch (contentCategory) {
      case "adverts":
        console.log("Rendering PreviewAdvert");
        bucket = (
          <PreviewAdvert
            name={row.original.name}
            advertiser={row.original.advertiser}
            image={row.original.coverImg}
            textBody={row.original.content}
            startDate={row.original.startDate}
            endDate={row.original.endDate}
            showPreview={showPreviewModal}
            setShowPreview={setShowPreviewModal}
          />
        );
        break;
      case "blogs":
        console.log("Rendering PreviewBlog");
        bucket = (
          <PreviewBlog
            title={row.original.title}
            authorName={row.original.authorName}
            contentBody={row.original.contentBody}
            showPreview={showPreviewModal}
            setShowPreview={setShowPreviewModal}
          />
        );
        break;
      case "gallery":
        console.log("Rendering PreviewGallery");
        bucket = (
          <PreviewGallery
            name={row.original.name}
            images={row.original.images}
            videos={row.original.videos}
            showPreview={showPreviewModal}
            setShowPreview={setShowPreviewModal}
          />
        );
        break;
      // case "resources":
      //   bucket = (
      //     <PreviewResource
      //       name={row.original.name}
      //       description={row.original.description}
      //       type={row.original.type}
      //       access={row.original.access}
      //       fileUrl={row.original.fileUrl}
      //       showPreview={showPreviewModal}
      //       setShowPreview={setShowPreviewModal}
      //     />
      //   );
      //   break;
      case "technical":
        console.log("Rendering PreviewTechnical");
        bucket = (
          <PreviewTechnical
            name={row.original.name}
            document={row.original.document}
            coverImg={row.original.coverImg}
            showPreview={showPreviewModal}
            setShowPreview={setShowPreviewModal}
          />
        );
        break;
      case "student":
        console.log("Rendering PreviewStudent");
        bucket = (
          <PreviewStudent
            name={row.original.name}
            document={row.original.document}
            showPreview={showPreviewModal}
            setShowPreview={setShowPreviewModal}
          />
        );
        break;
      case "faqs":
        console.log("Rendering PreviewFaq");
        bucket = (
          <PreviewFaq
            question={row.original.name}
            answer={row.original.answer}
            showPreview={showPreviewModal}
            setShowPreview={setShowPreviewModal}
          />
        );
        break;
      default:
        console.log("No matching content category found");
        break;
    }
    console.log("Final bucket component:", bucket);
  };

  const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePreview}>Preview</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowUnpublishModal(true)}>
            Unpublish
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="bg-red-600 text-white"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showUnpublishModal && (
        <UnpublishContent
          id={row.original.id}
          title={row.original.title}
          contentCategory={contentCategory}
          category={capitalizeWords(row.original.category ?? "")}
          date={row.original.published_date ?? ""}
          onClose={() => setShowUnpublishModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteContent
          id={row.original.id}
          title={row.original.title}
          contentCategory={contentCategory}
          category={capitalizeWords(row.original.category ?? "")}
          date={row.original.published_date ?? ""}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showEditModal && (
        <NewContent
          id={row.original.id}
          contentCategory={contentCategory}
          mode="edit"
          showModal={showEditModal}
          setShowModal={setShowEditModal}
        />
      )}
      {showPreviewModal && bucket}
    </>
  );
};

export default ActionsCell;
