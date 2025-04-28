"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import Toast from "@/components/genui/Toast";

function PublicationEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const cookies = new Cookies();
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [publication, setPublication] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/publications/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        });
        console.log("Publication details fetched:", response.data);
        setPublication(response.data.name || "");
        setEditDataFetched(true);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404
        ) {
          setEditDataFetched(true);
          console.error(
            "Publication not found (404). Stopping further fetch attempts."
          );
        } else {
          console.error("Error fetching Publication:", error);
        }
      }
    };
  });

  return (
    <div>
      <div>
        <InputEle
          label="Publication Title"
          type="text"
          id="title"
          onChange={() => {}}
        />
        <InputEle
          label="Upload File (PDF)"
          type="file"
          id="publication_file"
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button className="rounded-full py-2 bg-primary text-white text-base w-full">
          Publish Publication
        </button>
        <button className=" py-2 text-primary border border-primary text-base rounded-full w-full">
          Save as Draft
        </button>
        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
    </div>
  );
}

export default PublicationEdit;
