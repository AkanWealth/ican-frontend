"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";


import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

function PublicationEdit({ mode, id }: CreateContentProps) {
  const { toast } = useToast();
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [publication, setPublication] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`${BASE_API_URL}/publications/${id}`);
        console.log("Publication details fetched:", response.data);
        setPublication(response.name || "");
        setEditDataFetched(true);
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Publication not found.",
        });
      }
    };

      if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Publication details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

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
