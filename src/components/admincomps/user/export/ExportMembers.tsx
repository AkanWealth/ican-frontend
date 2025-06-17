import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { User } from "@/libs/types";
import { FiDownload } from "react-icons/fi";

interface ExportMembersProps {
  members: User[];
}

function flattenUser(user: User) {
  // Exclude sensitive fields and flatten role
  const {
    password,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpires,
    permissions,
    role,
    ...rest
  } = user;
  const flat: Record<string, any> = { ...rest };
  if (role) {
    Object.entries(role).forEach(([k, v]) => {
      flat[`role_${k}`] = v;
    });
  }
  return flat;
}

const ExportMembers: React.FC<ExportMembersProps> = ({ members }) => {
  const handleExport = () => {
    const flatMembers = members.map(flattenUser);
    const ws = XLSX.utils.json_to_sheet(flatMembers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, "-");
    XLSX.writeFile(wb, `members_export_${dateStr}.xlsx`);
  };

  return (
    <Button onClick={handleExport} variant="default" className="gap-2">
      <span>Export </span>
      <FiDownload className="w-4 h-4" />
    </Button>
  );
};

export default ExportMembers;
