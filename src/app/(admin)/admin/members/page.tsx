"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import { UserTable } from "@/components/admincomps/user/datatable/UserTable";
import { memberscolumns } from "@/components/admincomps/user/datatable/columns";
import { User } from "@/libs/types";
import { BASE_API_URL } from "@/utils/setter";

function MembersPage() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/users`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const result = await axios.request(config);
      if (result.status === 200) {
        setData(result.data.data);
      }
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
