"use client";

import React, { useEffect, useState } from "react";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { faqcolumns } from "@/components/admincomps/content/datatable/columns";
import {
  Content,
  contents,
} from "@/components/admincomps/content/datatable/colsdata";

async function getData(): Promise<Content[]> {
  return contents;
}
function Faq() {
  const [data, setData] = useState<Content[]>([]);

  useEffect(() => {
    async function fetchData() {
      const result = await getData();
      const filteredData = result.filter(
        (content) => content.category === "faq"
      );

      setData(filteredData);
    }
    fetchData();
  }, []);

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <h2 className="text-xl font-semibold text-left">FAQ</h2>
      <div>
        <ContentTable columns={faqcolumns} data={data} />
      </div>
    </div>
  );
}

export default Faq;
