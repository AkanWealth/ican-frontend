import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin, Loader2 } from "lucide-react";

import { EventDetails } from "@/libs/types";

import Image from "next/image";

interface EventsListProps {
  events: EventDetails[];
  loading: boolean;
  error: string | null;
  onRegisterClick: (event: EventDetails) => void;
}

const EventsList = ({
  events,
  loading,
  error,
  onRegisterClick,
}: EventsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-destructive">
          Failed to load events. Please try again later.
        </p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px] text-center p-8">
        <div>
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later for upcoming events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.isArray(events) && events.map((event) => (
        <Card
          key={event.id}
          className="flex flex-col h-full hover:shadow-md transition-shadow"
        >
          {event.flyer && (
            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
              <Image
                src={event.flyer}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <CardHeader className={!event.flyer ? "pt-4" : ""}>
            <CardTitle className="text-xl leading-tight">
              {event.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-2">
              <CalendarIcon className="h-4 w-4" />
              {new Date(event.date).toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow">
            <p className="text-sm line-clamp-3 mb-4">{event.description}</p>

            <div className="flex flex-col space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{event.venue}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4">
            <Button className="w-full" onClick={() => onRegisterClick(event)}>
              Register
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default EventsList;
