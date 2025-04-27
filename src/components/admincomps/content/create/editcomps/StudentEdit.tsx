"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import PreviewStudent from "../previewcomps/PreviewStudent";
import { useToast } from "@/hooks/use-toast";

type StudyPack = {
  name: string;
  document: string;
};

function StudentEdit({ mode, id }: CreateContentProps) {
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [student, setStudent] = useState<StudyPack>({ name: "", document: "" });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/studypacks/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        });
        console.log("Study Packs details fetched:", response.data);
        setStudent({
          name: response.data.name,
          document: response.data.amswer || "",
        });
        setEditDataFetched(true);
        toast({
          title: "Study Pack details fetched successfully",
          description: response.data.message,
          variant: "default",
        });
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404
        ) {
          setEditDataFetched(true);
          console.error(
            "Study Pack not found (404). Stopping further fetch attempts."
          );
          toast({
            title: "Study Pack not found",
            description: error.response.data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error fetching Study Pack",
            description:
              axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "An unknown error occurred",
            variant: "destructive",
          });
          console.error("Error fetching Study Pack:", error);
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Study Pack details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      name: student.name,
      document: student.document,
      status: status,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/studypacks/${id}`
          : `${BASE_API_URL}/studypacks`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Study Pack submitted successfully:", response.data);
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Study Pack submitted successfully",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Error submitting Study Pack",
        description:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An unknown error occurred",
        variant: "destructive",
      });
      console.error("Error submitting Study Pack:", error);
    }
  };

  return (
    <div>
      <div>
        <InputEle
          label="Title"
          type="text"
          id="name"
          value={student.name}
          onChange={(e) => setStudent({ ...student, name: e.target.value })}
        />
        <InputEle
          label="Upload File (PDF)"
          type="file"
          id="publication_file"
          value={student.document}
          onChange={() => {}}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setIsLoading(true);
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Study Packs"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setIsLoading(true);
            handleSubmit("draft");
          }}
          className=" py-2 text-primary border border-primary text-base rounded-full w-full"
        >
          {mode === "edit" ? "Save Edit" : "Save as Draft"}
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className=" py-1 text-primary text-base rounded-full w-full"
        >
          Preview
        </button>
      </div>
      {showPreview && (
        <PreviewStudent
          name={student.name}
          document={student.document}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  );
}

export default StudentEdit;
