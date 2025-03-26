"use client";

import React, { useState, useEffect } from "react";
import AttendanceRender from "../TabRender/AttendanceRender";
import MemberDueRender from "../TabRender/MemberDueRender";
import MetricMeetingRender from "../TabRender/MetricMeetingRender";


function Attendance(){
const [activeTab, setActiveTab] = useState('attendance');
const handleTabChange = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };
    return (
        <div className="p-4 md:p-8 bg-white rounded-lg border border-gray-400">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Overview</h1>
    
          <div className="w-full mb-4">
            <div className='flex w-full max-w-[560px] bg-gray-200 rounded-xl p-2'>
              <button
                onClick={() => handleTabChange('attendance')}
                className={`flex-1 text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg hover:bg-blue-700  ${activeTab === 'attendance'
                  ? 'bg-primary text-white'
                  : 'text-gray-800 hover:bg-gray-300'
                  }`}>
                Attendance Records
              </button>
              <button
                onClick={() => handleTabChange('dues')}
                className={`1 text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg ${activeTab === 'dues'
                  ? 'bg-primary text-white'
                  : 'text-gray-800 hover:bg-gray-300'
                  }`}
              >
                Meetings metric
              </button>
              <button
                onClick={() => handleTabChange('meeting')}
                className={`1 text-xs px-2 md:px-2 lg:px-8 py-2 rounded-lg ${activeTab === 'meeting'
                  ? 'bg-primary text-white'
                  : 'text-gray-800 hover:bg-gray-300'
                  }`}
              >
                Members dues and payment
              </button>
             
            </div>
            {/* <div className="text-sm text-gray-500 mt-6">{getTabDescription()}</div> */}
          </div>
         
    
          {/* Profile Photo Section */}

        {activeTab === 'attendance' && <AttendanceRender/>}
        {activeTab === 'dues' && <MetricMeetingRender/>}

           {activeTab === 'meeting' && <MemberDueRender/>}
       
        </div>
      );
      

}
export default Attendance;