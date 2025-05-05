"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  // Function to go back to the previous page
  const goBack = () => {
    router.back();
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-lg px-4">
        {/* Custom 404 image */}
        <div className="flex justify-center mb-2">
          <Image
            src="/404.png"
            alt="404 Error"
            width={300}
            height={150}
            priority
            className="mx-auto"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">Page not found</h2>
        <p className="text-gray-600">
          Sorry, we couldn't find the page you were looking for. It might have
          been removed, renamed, or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={goBack}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
