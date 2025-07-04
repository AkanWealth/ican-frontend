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
  MdPersonOutline,
  MdPublishedWithChanges,
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
import MakeMember from "./MakeMember";
import ChangeRole from "./ChangeRole";
import { useRouter } from "next/navigation";

interface CellProps {
  row: any; // Replace 'any' with the actual type of 'row'
}

const ActionsCell: React.FC<CellProps> = ({ row }) => {
  const router = useRouter();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showMakeModal, setShowMakeModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const capitalizeWords = (str: string): string => {
    if (typeof str !== "string") return "";
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (row.original.role.name === "MEMBER") {
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
            {row.original.isSuspended === false ? (
              <DropdownMenuItem
                onClick={() => setShowDisableModal(true)}
                className="flex flex-row items-center"
              >
                <FaUserXmark className="w-4 h-4" /> Suspend Member
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => setShowEnableModal(true)}
                className="flex flex-row items-center"
              >
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-red-600 hover:text-white text-red-600 flex flex-row items-center fill-red-600 "
              onClick={() => setShowDeleteModal(true)}
            >
              <MdOutlineDelete className="w-4 h-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showDisableModal && (
          <DisableAdmin
            id={row.original.id}
            fullName={row.original.firstname + " " + row.original.surname}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowDisableModal(false)}
          />
        )}
        {showEnableModal && (
          <EnableAdmin
            id={row.original.id}
            fullName={row.original.firstname + " " + row.original.surname}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowEnableModal(false)}
          />
        )}{" "}
        {showDeleteModal && (
          <DeleteAdmin
            id={row.original.id}
            fullName={
              row.original.fullName ||
              row.original.firstname + " " + row.original.surname
            }
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
      </>
    );
  } else {
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
              onClick={() => router.push(`members/${row.original.id}`)}
              className="flex flex-row items-center"
            >
              <MdRemoveRedEye className="w-4 h-4" /> View Admin Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowMakeModal(true)}
              className="flex flex-row items-center"
            >
              <MdPersonOutline className="w-4 h-4" /> Convert to Member
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowChangeModal(true)}
              className="flex flex-row items-center"
            >
              <MdPublishedWithChanges className="w-4 h-4" /> Change Roles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.isSuspended === false ? (
              <DropdownMenuItem
                className="flex flex-row items-center"
                onClick={() => setShowDisableModal(true)}
              >
                <MdOutlineToggleOn className="w-4 h-4" /> Suspend Admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="flex flex-row items-center"
                onClick={() => setShowEnableModal(true)}
              >
                <MdOutlineToggleOff className="w-4 h-4" /> Reactivate Admin
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:bg-red-600 hover:text-white text-red-600 flex flex-row items-center fill-red-600 "
              onClick={() => setShowDeleteModal(true)}
            >
              <MdOutlineDelete className="w-4 h-4" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {showDisableModal && (
          <DisableAdmin
            id={row.original.id}
            fullName={row.original.firstname + " " + row.original.surname}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowDisableModal(false)}
          />
        )}
        {showEnableModal && (
          <EnableAdmin
            id={row.original.id}
            fullName={row.original.firstname + " " + row.original.surname}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowEnableModal(false)}
          />
        )}
        {showDeleteModal && (
          <DeleteAdmin
            id={row.original.id}
            fullName={
              row.original.fullName ||
              row.original.firstname + " " + row.original.surname
            }
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
        {showMakeModal && (
          <MakeMember
            id={row.original.id}
            fullName={row.original.firstname + " " + row.original.surname}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowMakeModal(false)}
          />
        )}
        {showChangeModal && (
          <ChangeRole
            id={row.original.id}
            fullName={row.original.firstname + " " + row.original.surname}
            role={capitalizeWords(row.original.role.name ?? "")}
            onClose={() => setShowChangeModal(false)}
          />
        )}
      </>
    );
  }
};

export default ActionsCell;
