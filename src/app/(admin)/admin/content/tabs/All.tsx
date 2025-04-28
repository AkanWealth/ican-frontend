"use client";

import React, { useEffect, useState } from "react";
import { ContentTable } from "@/components/admincomps/content/datatable/ContentTable";
import { allcolumns } from "@/components/admincomps/content/datatable/columns";

import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

function All() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdvertsData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/adverts`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/adverts", config);
        setData((prevData) => [...prevData, ...response.data.data]);
          console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchBlogsData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/blogs`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/blogs", config);
        setData((prevData) => [...prevData, ...response.data]);
        
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchFAQData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/faqs`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/faqs", config);
        setData((prevData) => [...prevData, ...response.data.faqs]);
        console.log(response.faqs);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchGalleryData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/gallery`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/gallery", config);
        setData((prevData) => [...prevData, ...response.data.data]);

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchStudyData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/studypacks`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/studypacks", config);
        setData((prevData) => [...prevData, ...response.data.studyPacks]);
        console.log(response.studyPacks);
        
      } catch (error) {
        console.error(error);
      }
    }
    async function fetchTSData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/technical-sessions`,
        headers: {},
      };
      try {
        const response = await apiClient.get("/technical-sessions", config);
        setData((prevData) => [...prevData, ...response.data.sessions]);
        console.log(response.sessions);
      } catch (error) {
        console.error(error);
      }
    }


    fetchTSData();
    fetchStudyData();
    fetchGalleryData();
    fetchFAQData();
    fetchBlogsData();
    fetchAdvertsData();
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
