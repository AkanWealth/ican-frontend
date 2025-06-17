import React from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { EventDetails, RegisteredUsers } from "@/libs/types";
import { FiDownload } from "react-icons/fi";

interface ExportEventDetailProps {
  events: EventDetails[];
  registeredUsers: RegisteredUsers[];
}

const ExportEventDetail: React.FC<ExportEventDetailProps> = ({
  events,
  registeredUsers,
}) => {
  const handleExport = () => {
    // Sheet 1: Events
    const wsEvents = XLSX.utils.json_to_sheet(events);
    // Sheet 2: Registered Users
    const wsRegistered = XLSX.utils.json_to_sheet(registeredUsers);

    // Create workbook and append sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsEvents, "Events");
    XLSX.utils.book_append_sheet(wb, wsRegistered, "Registered Users");

    // Export with event name in the filename (use first event if available)
    const eventName =
      events.length > 0
        ? events[0].name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : "event";
    XLSX.writeFile(wb, `${eventName}_export_${new Date().toISOString()}.xlsx`);
  };

  return (
    <Button onClick={handleExport} variant="default" className="gap-2">
      <span>Export Event</span>
      <FiDownload className="w-4 h-4" />
    </Button>
  );
};

export default ExportEventDetail;
