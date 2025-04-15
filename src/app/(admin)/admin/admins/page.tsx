"use client";

import React, { useEffect, useState } from "react";
import { UserTable } from "@/components/admincomps/user/datatable/UserTable";
import { adminscolumns } from "@/components/admincomps/user/datatable/columns";
import { User } from "@/libs/types";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import CreateNewAdmin from "@/components/admincomps/admin/CreateNewAdmin";

function AdminManagementPage() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/admins`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };
      const result = await axios.request(config);

      setData(result.data);
    }
    fetchData();
  }, []);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">
            All Administrators
          </h2>
          <p>View and manage all admins details here</p>
        </div>
        <div className="flex flex-row items-center gap-4 justify-end">
          <button className="rounded-full py-2 px-3 bg-transparent text-primary border-primary text-base w-fit">
            Manage Roles
          </button>
          <button className=" py-2 px-3 text-white bg-primary  text-base rounded-full w-fit">
            Add Administrator
          </button>
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <h2 className="text-xl font-semibold text-left">Administrators</h2>
        <div>
          <UserTable columns={adminscolumns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default AdminManagementPage;
