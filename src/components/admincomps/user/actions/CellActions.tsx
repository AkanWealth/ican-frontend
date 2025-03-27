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
  MdRemoveRedEye,
  MdOutlineToggleOn,
  MdOutlineDelete,
  MdOutlineToggleOff,
} from "react-icons/md";
import { FaUserXmark, FaUserCheck } from "react-icons/fa6";

import { MoreHorizontal } from "lucide-react";
import DisableAdmin from "./DisableAdmin";
import DeleteAdmin from "./DeleteAdmin";
import EnableAdmin from "./EnableAdmin";
import { useRouter } from "next/navigation";

interface CellProps {
  row: any; // Replace 'any' with the actual type of 'row'
}

const ActionsCell: React.FC<CellProps> = ({ row }) => {
  const router = useRouter();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (row.original.role === "member") {
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
            {row.original.status === "active" ? (
              <DropdownMenuItem className="flex flex-row items-center">
                <FaUserXmark className="w-4 h-4" /> Suspend Member
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="flex flex-row items-center">
                <FaUserCheck className="w-4 h-4" /> Reactivate Member
              </DropdownMenuItem>
            )}{" "}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`members/${row.original.id}`)}
              className="flex flex-row items-center"
            >
              <MdRemoveRedEye className="w-4 h-4" /> View Member Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }
  if (row.original.role === "admin" || row.original.role === "super admin") {
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
            <DropdownMenuItem
              onClick={() => router.push(`admins/${row.original.id}`)}
              className="flex flex-row items-center"
            >
              <MdRemoveRedEye className="w-4 h-4" /> View Admin Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status === "active" ? (
              <DropdownMenuItem
                className="flex flex-row items-center"
                onClick={() => setShowDisableModal(true)}
              >
                <MdOutlineToggleOn className="w-4 h-4" /> Disable Admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="flex flex-row items-center"
                onClick={() => setShowEnableModal(true)}
              >
                <MdOutlineToggleOff className="w-4 h-4" /> Enable Admin
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-red-600 hover:text-white text-red-600 flex flex-row items-center fill-red-600 "
              onClick={() => setShowDeleteModal(true)}
            >
              <MdOutlineDelete className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showDisableModal && (
          <DisableAdmin
            id={row.original.id}
            fullName={row.original.firstName + " " + row.original.lastName}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowDisableModal(false)}
          />
        )}
        {showEnableModal && (
          <EnableAdmin
            id={row.original.id}
            fullName={row.original.fullName}
            role={capitalizeWords(row.original.role ?? "")}
            onClose={() => setShowDisableModal(false)}
          />
        )}
        {showDeleteModal && (
          <DeleteAdmin
            id={row.original.id}
            fullName={row.original.fullName}
            role={capitalizeWords(row.original.role ?? "")}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </>
    );
  }
};

export default ActionsCell;
