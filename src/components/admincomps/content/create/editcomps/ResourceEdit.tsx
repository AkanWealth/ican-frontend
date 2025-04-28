"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

interface Resource {
  title: string;
  description: string;
  type: string;
  access: string;
  fileurl: string;
}

function ResourceEdit({ mode, id }: CreateContentProps) {
  const { toast } = useToast();
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [resource, setResource] = useState<Resource>({
    title: "",
    description: "",
    type: "",
    access: "",
    fileurl: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setResource((prevResource) => ({
      ...prevResource,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(
          `${BASE_API_URL}/resources/content/${id}`
        );
        console.log("Resource details fetched:", response.data);
        setResource(response.data.name || "");
        setEditDataFetched(true);
        setIsSubmitting(false);
        toast({
          title: "Resource details fetched successfully",
          description: "Resource details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Resource not found.",
        });
        setIsSubmitting(false);
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Resource details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await apiClient.post(
        `${BASE_API_URL}/resources/content`,
        resource
      );
      console.log("Resource created:", response.data);
      toast({
        title: "Resource created successfully",
        description: "Resource created successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: "Error creating resource",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-between">
        <InputEle
          label="Resource Title"
          type="text"
          id="title"
          onChange={() => {}}
          value={resource.title}
        />
        <InputEle
          label="Resource Description"
          type="text"
          id="description"
          onChange={() => {}}
          value={resource.description}
        />
        <InputEle
          label="Resource Type"
          type="text"
          id="type"
          onChange={() => {}}
          value={resource.type}
        />
        <InputEle
          label="Resource Access"
          type="select"
          id="access"
          onChange={() => {}}
          options={[
            { value: "PUBLIC", label: "Public" },
            { value: "MEMBERS", label: "Members" },
          ]}
          value={resource.access}
        />
        <InputEle
          label="Upload File (PDF)"
          type="file"
          id="resource_file"
          onChange={() => {}}
          value={resource.fileurl}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {isSubmitting ? "Uploading..." : "Upload Resource"}
        </button>

        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
    </div>
  );
}

export default ResourceEdit;
