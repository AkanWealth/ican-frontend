import React from "react";
import { Clock, Info } from "lucide-react";

function Dashboard() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      {/* Main Card */}
      <div className="flex flex-col p-4 sm:p-6 bg-blue-900 rounded-lg">
        {/* Greeting Section */}
        <div className="text-left">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Welcome Oloruntomi!</h2>
          <div className="flex flex-row items-center text-white mt-4 sm:mt-6 text-sm">
            <span>Thursday, February 6</span>
            <span className="flex items-center bg-gray-100 text-black ml-2 text-xs rounded-md px-2 py-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Under review
            </span>
          </div>
        </div>
      </div>

      {/* Notification Section */}
      <div className="flex flex-row gap-2 sm:gap-5 mt-4 sm:mt-8">
        <Info className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
        <p className="text-gray-500 text-base sm:text-sm">
          Your account is being reviewed. We will send an email to you once <br/>
          review is complete. Please keep an eye on your email.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;