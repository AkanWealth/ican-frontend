"use client";

import React, { useState, useEffect } from "react";
import { UserTable } from "@/components/admincomps/user/datatable/UserTable";
import { memberscolumns } from "@/components/admincomps/user/datatable/columns";
import { User, users } from "@/components/admincomps/user/datatable/colsdata";

export async function getData(): Promise<User[]> {
  return users;
}

function MembersPage() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      const filteredData = result.filter((user) => user.role === "member");
      setData(filteredData);
    }
    fetchData();
  }, []);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">
            Member&apos;s Account
          </h2>
          <p>Manage user details here</p>
        </div>
      </div>

      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">All Members</h2>
        <div>
          <UserTable columns={memberscolumns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default MembersPage;
