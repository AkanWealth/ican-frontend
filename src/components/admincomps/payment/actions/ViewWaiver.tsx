import React, { useState, useEffect } from "react";
import { WaiverCode } from "@/libs/types";
import DeleteWaiver from "./DeleteWaiver";
import { MdClose } from "react-icons/md";



interface ViewWaiverProps {
  waiver: WaiverCode;
  onClose: () => void;
}

const ViewWaiver = ({ waiver, onClose }: ViewWaiverProps) => {
  const [members, setMembers] = useState(waiver.usedBy || []);
  const [showDelete, setShowDelete] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMembers(waiver.usedBy || []);
  }, [waiver]);

  const currentTime = new Date();
  const expirationTime = new Date(waiver.expiresAt);
  const status = currentTime > expirationTime ? "expired" : "active";

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <MdClose size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold mb-1">Waiver Details</h2>
        <p className="text-gray-500 mb-4">
          Full details for this waiver code and its usage history.
        </p>

        {/* Waiver Info */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-y-2 gap-x-6">
            <div>
              <span className="text-gray-500">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {status}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Waiver Code:</span>
              <span className="ml-2 font-medium">{waiver.code}</span>
            </div>
            <div>
              <span className="text-gray-500">Applies To:</span>
              <span className="ml-2">{waiver?.billing?.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Created By:</span>
              <span className="ml-2">{waiver.createdBy.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Created On:</span>
              <span className="ml-2">
                {new Date(waiver.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Expires On:</span>
              <span className="ml-2">
                {new Date(waiver.expiresAt).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Used By:</span>
              <span className="ml-2">{members.length} members</span>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Members Who Used This Waiver</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium">
                    Member Name
                  </th>
                  <th className="px-3 py-2 text-left font-medium">Member ID</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-3 py-2">{m.id}</td>
                    <td className="px-3 py-2">{m.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-6 py-2 rounded border border-red-500 text-red-600 font-semibold hover:bg-red-50"
            onClick={() => setShowDelete(true)}
          >
            Delete
          </button>
        </div>

        {/* Delete Dialog */}
        {showDelete && (
          <DeleteWaiver
            id={waiver.id}
            code={waiver.code}
            billName={waiver?.billing?.name || ""}
            amount={waiver?.billing?.amount?.toString() || ""}
            createdAt={waiver.createdAt}
            onClose={() => setShowDelete(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ViewWaiver;
