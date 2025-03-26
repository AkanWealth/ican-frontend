"use client";

import React, { useState } from "react";

function AdminDetails() {
  const [permissions, setPermissions] = useState([
    {
      action: "Event management",
      create: false,
      view: false,
      manage: false,
      delete: false,
    },
    {
      action: "Members accounts",
      create: false,
      view: false,
      manage: false,
      delete: false,
    },
    {
      action: "Payments",
      create: false,
      view: false,
      manage: false,
      delete: false,
    },
    {
      action: "Content management",
      create: false,
      view: false,
      manage: false,
      delete: false,
    },
  ]);

  const handleCheckboxChange = (
    index: number,
    column: "create" | "view" | "manage" | "delete"
  ) => {
    setPermissions((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [column]: !row[column] } : row
      )
    );
    console.log(permissions);
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibol text-2xl text-black">Manage Roles </h2>
          <p className=" text-base text-neutral-600  ">Create new role here</p>
        </div>
        <div className="flex flex-row items-center gap-4 justify-end"></div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <div>
          <h2 className="text-lg font-semibold text-black">Roles </h2>
        </div>

        <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
          <table className="table-auto w-full border-collapse border border-neutral-300">
            <thead>
              <tr>
                <th className="border border-neutral-300 px-4 py-2 text-left">
                  Action
                </th>
                <th className="border border-neutral-300 px-4 py-2">Create</th>
                <th className="border border-neutral-300 px-4 py-2">View</th>
                <th className="border border-neutral-300 px-4 py-2">Manage</th>
                <th className="border border-neutral-300 px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((row, index) => (
                <tr key={index}>
                  <td className="border border-neutral-300 px-4 py-2">
                    {row.action}
                  </td>
                  {["create", "view", "manage", "delete"].map((column) => (
                    <td
                      key={column}
                      className="border border-neutral-300 px-4 py-2 text-center"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(row[column as keyof typeof row])}
                        onChange={() =>
                          handleCheckboxChange(
                            index,
                            column as "create" | "view" | "manage" | "delete"
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 border-primary border bg-white text-primary rounded-full "
              onClick={() =>
                setPermissions((prev) =>
                  prev.map((row) => ({
                    ...row,
                    create: false,
                    view: false,
                    manage: false,
                    delete: false,
                  }))
                )
              }
            >
              Reset all
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-full"
              onClick={() => console.log("Saved Permissions:", permissions)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;
