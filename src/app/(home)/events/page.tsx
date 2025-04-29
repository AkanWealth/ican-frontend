"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import Heroimg from "@/components/homecomps/Heroimg";
import EventsList from "@/components/events/EventsList";
import EventsFilter from "@/components/events/EventsFilter";
import RegisterModal from "@/components/events/RegisterModal";

import { EventDetails } from "@/libs/types";

function EventsPage() {
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const { toast } = useToast();

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/events`);
        // Ensure we're handling the response data properly
        const eventsData = Array.isArray(response.data.data) ? response.data.data : [];
        setEvents(eventsData);
        console.log(eventsData);
        console.log(response.data.data);
        setFilteredEvents(eventsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        toast({
          title: "Error fetching events",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    };

    fetchEvents();
  }, [toast]);

  // Filter and sort events
  useEffect(() => {
    // Ensure events is an array before filtering
    if (!Array.isArray(events)) {
      setFilteredEvents([]);
      return;
    }

    let result = [...events];

    

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.name.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredEvents(result);
  }, [events, selectedType, searchQuery, sortOrder]);

  // Handler for opening modal with specific event
  const handleRegisterClick = (event: EventDetails) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Heroimg
        subtxt={"Join us at our upcoming events"}
        toggle={false}
        maintxt="Events"
        imageUrl="/eventshero.jpg"
      />

      <div className="w-full px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto py-8">
        <EventsFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          events={events || []} // Ensure events is always an array
        />

        <EventsList
          events={filteredEvents}
          loading={loading}
          error={error}
          onRegisterClick={handleRegisterClick}
        />
      </div>

      {selectedEvent && (
        <RegisterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
}

export default EventsPage;
