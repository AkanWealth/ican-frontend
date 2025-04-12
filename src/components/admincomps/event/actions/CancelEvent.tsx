import React from "react";
import { MdSubtitles, MdDeleteOutline } from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";

interface CancelEventProps {
  id: string;
  eventName: string;
  date: string;
  onClose: () => void;
}

function CancelEvent({ id, eventName, date, onClose }: CancelEventProps) {
  const handleDelete = () => {
    console.log({ id, eventName, date });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 rounded-xl gap-4 bg-white">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-red-200">
            <MdDeleteOutline className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-xl text-black">Cancel Event</h5>
              <p className="text-sm text-neutral-600">
                If you cancel this event, the event will no longer take place
                and members will be notified via email. Are you sure you want to
                proceed?{" "}
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Name:
                </p>
                <p className="text-black font-medium text-base ">{eventName}</p>
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-centerflex-row gap-2">
                  <HiOutlineTag className="w-4 h-4" /> Date:
                </p>
                <p className="text-black font-medium text-base ">{date}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center w-2/5 text-center justify-center bg-red-600 font-semibold text-base text-white rounded-full py-3 px-4 h-10"
          >
            Yes, Please
          </button>
          <button
            onClick={onClose}
            className="flex items-center w-2/5 text-center justify-center bg-transparent font-semibold text-base text-neutral-700 border border-primary rounded-full py-3 px-4 h-10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CancelEvent;
