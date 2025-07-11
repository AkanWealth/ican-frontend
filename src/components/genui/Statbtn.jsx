import React from "react";
import {
  MdCheckCircleOutline,
  MdAccessTime,
  MdOutlineCancel,
} from "react-icons/md";

function Statbtn({ status }) {
  //   "published" | "draft" | "hidden" | "expired" | "pending";
  const statusStyles = {
    published: {
      bg: "bg-green-100",
      text: "text-green-600",
      fill: "fill-green-600",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Published",
    },
    success: {
      bg: "bg-green-100",
      text: "text-green-600",
      fill: "fill-green-600",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Success",
    },
    waived: {
      bg: "bg-green-100",
      text: "text-green-600",
      fill: "fill-green-600",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Waived",
    },
    active: {
      bg: "bg-green-100",
      text: "text-green-600",
      fill: "fill-green-600",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Active",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-600",
      fill: "fill-green-600",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Completed",
    },
    present: {
      bg: "bg-green-100",
      text: "text-green-600",
      fill: "fill-green-600",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Present",
    },
    draft: {
      bg: "bg-neutral-200",
      text: "text-neutral-950",
      fill: "fill-neutral-900",
      icon: <MdAccessTime className="w-4 h-4" />,
      label: "Draft",
    },
    pending: {
      bg: "bg-neutral-200",
      text: "text-neutral-950",
      fill: "fill-neutral-900",
      icon: <MdAccessTime className="w-4 h-4" />,
      label: "Pending",
    },
    registered: {
      bg: "bg-neutral-200",
      text: "text-neutral-950",
      fill: "fill-neutral-900",
      icon: <MdAccessTime className="w-4 h-4" />,
      label: "Registered",
    },
    upcoming: {
      bg: "bg-neutral-200",
      text: "text-neutral-950",
      fill: "fill-neutral-900",
      icon: <MdAccessTime className="w-4 h-4" />,
      label: "Upcoming",
    },
    suspended: {
      bg: "bg-neutral-200",
      text: "text-neutral-950",
      fill: "fill-neutral-900",
      icon: <MdAccessTime className="w-4 h-4" />,
      label: "Suspended",
    },
    hidden: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Hidden",
    },
    expired: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Expired",
    },
    cancelled: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Cancelled",
    },
    overdue: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Overdue",
    },
    absent: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Absent",
    },
    inactive: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Inactive",
    },
    not_paid: {
      bg: "bg-red-200",
      text: "text-red-500",
      fill: "fill-red-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Not Paid",
    },
    partially_paid: {
      bg: "bg-yellow-200",
      text: "text-yellow-500",
      fill: "fill-yellow-500",
      icon: <MdOutlineCancel className="w-4 h-4" />,
      label: "Partially Paid",
    },
    paid: {
      bg: "bg-green-200",
      text: "text-green-500",
      fill: "fill-green-500",
      icon: <MdCheckCircleOutline className="w-4 h-4" />,
      label: "Paid",
    },
  };

  const style = status ? statusStyles[status.toLowerCase()] : null;

  if (!style) return null;

  return (
    <button
      className={`flex flex-row items-center gap-2 ${style.bg} ${style.text} ${style.fill} py-1 px-2 rounded`}
    >
      {style.icon} {style.label}
    </button>
  );
}

export default Statbtn;
