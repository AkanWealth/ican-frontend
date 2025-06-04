"use client";
import React from 'react';
import { X, Calendar, MapPin, Clock, Check } from 'lucide-react';
import Image from 'next/image';

interface Event {
  id: string;
  name: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  fee: number;
  mcpd_credit: number;
  flyer: string;
  meeting_link: string;
  status: string;
}

interface AlreadyRegisteredModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const AlreadyRegisteredModal: React.FC<AlreadyRegisteredModalProps> = ({ 
  isOpen, 
  onClose,
  event
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Check className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Already Registered</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-blue-900" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">
              You're already registered for this event
            </h3>
            <p className="text-gray-600 text-center text-sm">
              You have successfully registered for this event. No need to register again.
            </p>
          </div>

          {/* Event Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-bold mb-2">{event.name}</h4>
            
            <div className="flex items-start mb-2">
              <Calendar className="w-4 h-4 text-gray-500 mr-2 mt-1" />
              <div>
                <p className="text-sm text-gray-700">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-start mb-2">
              <Clock className="w-4 h-4 text-gray-500 mr-2 mt-1" />
              <div>
                <p className="text-sm text-gray-700">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
              <div>
                <p className="text-sm text-gray-700">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Support info */}
          <div className="text-xs text-gray-600 mb-4">
            If you need to make changes to your registration or have any questions,
            please contact us at{" "}
            <a
              href="mailto:icansuruleredistrictsociety@gmail.com"
              className="text-blue-900 underline hover:text-blue-800"
            >
              icansuruleredistrictsociety@gmail.com
            </a>{" "}
            or call{" "}
            <span className="text-blue-900">+234 808 816 8895</span>.
          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlreadyRegisteredModal;