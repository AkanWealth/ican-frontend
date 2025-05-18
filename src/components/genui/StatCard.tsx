import React from "react";
import { StatCardProps } from "@/libs/types";

function StatCard({ name, metric, Icon }: StatCardProps) {
  return (
    <div className="flex flex-row gap-4 p-4 max-w-60 items-start justify-between border rounded-xl bg-white">
      <div className="p-2 bg-blue-200 rounded-full">
        <Icon className=" w-3 h-3 " />
      </div>
      <div className=" flex flex-col gap-1 justify-start ">
        <p className="font-medium text-gray-500 text-sm">{name}</p>
        <p className=" font-bold text-3xl text-black  ">{metric}</p>
      </div>
    </div>
  );
}

export default StatCard;
