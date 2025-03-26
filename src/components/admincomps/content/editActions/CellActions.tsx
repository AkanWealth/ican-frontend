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

interface CellProps {
  row: any; // Replace 'any' with the actual type of 'row'
}

const ActionsCell: React.FC<CellProps> = ({ row }) => {
  const [showUnpublishModal, setShowUnpublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Preview</DropdownMenuItem>
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
          category={capitalizeWords(row.original.category ?? "")}
          date={row.original.published_date ?? ""}
          onClose={() => setShowUnpublishModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteContent
          id={row.original.id}
          title={row.original.title}
          category={capitalizeWords(row.original.category ?? "")}
          date={row.original.published_date ?? ""}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default ActionsCell;
