'use client';
import React, { useState, ReactNode } from 'react';
import { Calendar, X } from 'lucide-react';
import CalendarFilter from '@/components/CalendarFilter';
import Image from 'next/image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface FormData {
  eventName: string;
  description: string;
}

interface FormErrors {
  eventName?: string;
  description?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-12 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};


const MCPDRecords = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    eventName: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const resetActivities = () => {
    setActivities([
      { name: "Advanced Leadership Workshop", date: "Jan 15, 2025", points: 15, certificate: true },
      { name: "Advanced Leadership Workshop", date: "Jan 15, 2025", points: 15, certificate: true },
      { name: "Advanced Leadership Workshop", date: "Jan 15, 2025", points: 15, certificate: true },
      { name: "Networking Event", date: "Dec 10, 2024", points: null, certificate: false },
      { name: "Networking Event", date: "Dec 10, 2024", points: null, certificate: false },
    ]);
  };

  const [activities, setActivities] = useState([
    { name: "Advanced Leadership Workshop", date: "Jan 15, 2025", points: 15, certificate: true },
    { name: "Advanced Leadership Workshop", date: "Jan 15, 2025", points: 15, certificate: true },
    { name: "Advanced Leadership Workshop", date: "Jan 15, 2025", points: 15, certificate: true },
    { name: "Networking Event", date: "Dec 10, 2024", points: null, certificate: false },
    { name: "Networking Event", date: "Dec 10, 2024", points: null, certificate: false },
  ]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);

    const selectedDateObj = new Date(date);

    const filteredActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === selectedDateObj.getDate() &&
        activityDate.getMonth() === selectedDateObj.getMonth() &&
        activityDate.getFullYear() === selectedDateObj.getFullYear()
      );
    });

    setActivities(filteredActivities);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    if (!formData.eventName.trim()) {
      errors.eventName = 'Event/Activity Name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    const handleExportPDF = () => {
      // Implement PDF export logic here
      console.log('Exporting as PDF...');
    };

    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
    setFormData({ eventName: '', description: '' });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Set up the title
    doc.setFontSize(18);
    doc.text('My MCPD Points', 14, 22);
  
    // Prepare table data
    const tableData = activities.map(activity => [
      activity.name,
      activity.date,
      activity.points ?? 'No Points',
      activity.certificate ? 'Yes' : 'No'
    ]);
  
    // Add summary information
    doc.setFontSize(10);
    doc.text(`Total Points: 85`, 14, 30);
    doc.text(`Progress to Goal: 85%`, 14, 36);
  
    // Generate the table using autoTable plugin
    (doc as any).autoTable({
      head: [['Event/Activity Name', 'Date', 'Points Awarded', 'Certificate']],
      body: tableData,
      startY: 44,
      theme: 'striped',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: { 
        fillColor: [41, 128, 185], // Primary blue color
        textColor: 255 // White text
      }
    });
  
    // Save the PDF
    doc.save('MCPD_Points_Record.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">My MCPD Points</h1>
              <p className="text-gray-600 font-semibold">Track your professional development progress and stay on top of your goals.</p>
            </div>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 text-xs bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-blue-700"
            >
              Export as PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-gray-600 mb-2">Total Points</h3>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold">85</span>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Image
                    src="/goal 1.png"
                    width={400}
                    height={400}
                    alt='goal'
                    className='w-full'
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between mb-2">
                <h3 className="text-gray-600">Progress to Goal</h3>
                <span className="font-semibold">85%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-full w-[85%] bg-primary rounded-full" />

              </div>
              <p className="text-sm text-gray-500 mt-2">85/100 Points</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between mb-2">
                <h6 className="text-[13px] text-gray-700">If you find any discrepancies in your MCPD points, let us know we can resolve it quickly.</h6>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 px-4 py-2 bg-primary text-white text-xs rounded-full hover:bg-blue-700">
                Report an Issue
              </button>

            </div>
          </div>

          <div className="bg-white max-w-[1100px] flex flex-col item-center rounded-xl border border-gray-300 p-4">
            <div className="flex justify-between items-center p-4">
              <h3 className="font-semibold text-lg">Points Earned by Activity</h3>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent closing when clicking the button
                    setIsCalendarOpen(!isCalendarOpen);
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Filter by Date</span>
                </button>
                <CalendarFilter
                  isOpen={isCalendarOpen}
                  onClose={() => setIsCalendarOpen(false)}
                  onSelect={handleDateSelect}
                />
              </div>
            </div>

            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500 py-4">No activities found for the selected date.</p>
                <button
                  onClick={resetActivities}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <table className="w-full justify-center item-center border-b border-gray-200 px-4">
                <thead className="border-b border-t-none border-gray-300">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Event/Activity Name</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Points Awarded</th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {activities.map((activity, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{activity.name}</td>
                      <td className="px-6 py-4">{activity.date}</td>
                      <td className="px-6 py-4">{activity.points ?? "No Points"}</td>
                      <td className="px-6 py-4">
                        {activity.certificate ? (
                          <button className="px-4 py-1 bg-primary text-white text-sm rounded-full hover:bg-blue-700">
                            Download
                          </button>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Report Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Event/Activity Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter event name"
            />
            {formErrors.eventName && (
              <p className="mt-1 text-sm text-red-500">{formErrors.eventName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description of Issue<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg h-36"
              placeholder="Enter details of the issue"
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default MCPDRecords;