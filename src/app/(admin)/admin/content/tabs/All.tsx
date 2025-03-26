"use client";

import React, { useEffect, useState } from "react";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { allcolumns } from "@/components/admincomps/content/datatable/columns";
import {
  Content,
  contents,
} from "@/components/admincomps/content/datatable/colsdata";

export async function getData(): Promise<Content[]> {
  return contents;
}

function All() {
  const [data, setData] = useState<Content[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">All Content</h2>
      <div>
        <ContentTable columns={allcolumns} data={data} />
      </div>
    </div>
  );
}

export default All;
