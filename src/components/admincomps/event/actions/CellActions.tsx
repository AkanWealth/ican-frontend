import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  MdEdit,
  MdOutlineCancel,
  MdOutlineDelete,
  MdOutlineRemoveRedEye,
} from "react-icons/md";

import { MoreHorizontal } from "lucide-react";
import CancelEvent from "./CancelEvent";
import DeleteEvent from "./DeleteEvent";
import NewEvent from "../create/NewEvent";
import { useRouter } from "next/navigation";

interface CellProps {
  row: any; // Replace 'any' with the actual type of 'row'
}

const ActionsCell: React.FC<CellProps> = ({ row }) => {
  const [showEditModal, setshowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter(); // Hook to navigate programmatically

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
          <DropdownMenuItem className="flex flex-row items-center">
            <MdEdit className="w-4 h-4" /> Edit Event Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex flex-row items-center"
            onClick={() => router.push(`/admin/events/${row.original.id}`)}
          >
            <MdOutlineRemoveRedEye className="w-4 h-4" /> View Event Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:bg-red-600 hover:text-white text-red-600 flex flex-row items-center fill-red-600 "
            onClick={() => setShowCancelModal(true)}
          >
            <MdOutlineCancel className="w-4 h-4" />
            Cancel Event
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:bg-red-600 hover:text-white text-red-600 flex flex-row items-center fill-red-600 "
            onClick={() => setShowDeleteModal(true)}
          >
            <MdOutlineDelete className="w-4 h-4" />
            Delete Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showEditModal && (
        <NewEvent
          id={row.original.id} // Ensure NewEvent accepts this prop
          mode="edit"
          showNewEvent={showEditModal}
          setShowNewEvent={setshowEditModal}
        />
      )}

      {showCancelModal && (
        <CancelEvent
          id={row.original.id}
          eventName={row.original.name}
          date={row.original.date}
          onClose={() => setShowCancelModal(false)}
        />
      )}
      {showDeleteModal && (
        <DeleteEvent
          id={row.original.id}
          eventName={row.original.name}
          date={row.original.date}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
      {showCancelModal && (
        <CancelEvent
          id={row.original.id}
          eventName={row.original.name}
          date={row.original.date}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </>
  );
};

export default ActionsCell;
