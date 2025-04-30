import React, { useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { EventDetails } from "@/libs/types";

interface EventsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  events: EventDetails[];
}

const EventsFilter = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  sortOrder,
  setSortOrder,
  events,
}: EventsFilterProps) => {
  // Safely extract unique event types from the events array
  const eventTypes = useMemo(() => {
    if (!Array.isArray(events)) return [];

    try {
      // Ensure each event has an eventType before extracting
      const types = events
        .filter(
          (event) => event && typeof event === "object" && "eventType" in event
        )
        .map((event) => event.eventType)
        .filter(Boolean); // Remove any undefined/null/empty values

      return Array.from(new Set(types));
    } catch (error) {
      console.error("Error extracting event types:", error);
      return [];
    }
  }, [events]);

  return (
    <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[250px]">
        <Label htmlFor="search" className="mb-2 block">
          Search Events
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="w-full sm:w-auto">
        <Label htmlFor="sortOrder" className="mb-2 block">
          Sort By Date
        </Label>
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
        >
          <SelectTrigger id="sortOrder" className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Earliest First</SelectItem>
            <SelectItem value="desc">Latest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EventsFilter;
