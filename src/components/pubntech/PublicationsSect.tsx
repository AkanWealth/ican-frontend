import React from "react";
import { Resource } from "@/libs/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PublicationsSectProps {
  publications: Resource[];
  loading: boolean;
  error: string | null;
}

function PublicationsSect({
  publications,
  loading,
  error,
}: PublicationsSectProps) {
  console.log(publications);
  console.log(loading);
  console.log(error);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] sm:min-h-[300px]">
        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] sm:min-h-[300px] px-4 text-center">
        <p className="text-destructive text-sm sm:text-base">
          Failed to load publications. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-6 sm:py-8 md:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
        Our Publications
      </h2>

      {publications.length === 0 ? (
        <p className="text-center text-muted-foreground px-4">
          No publications available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4">
          {publications.map((publication) => (
            <Card
              key={publication.id}
              className="flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">
                  {publication.title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {new Date(publication.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow py-2 sm:py-4">
                <p className="line-clamp-3 text-sm sm:text-base">
                  {publication.description}
                </p>
              </CardContent>
              <CardFooter className="pt-2 sm:pt-4">
                <Button className="w-full text-sm sm:text-base" asChild>
                  <a
                    href={publication.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Download Publication
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default PublicationsSect;
