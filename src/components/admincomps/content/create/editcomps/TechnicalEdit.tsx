import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useToast } from "@/hooks/use-toast";

import PreviewTechnical from "../previewcomps/PreviewTechnical";

type TechnicalSession = {
  name: string;
  document: string;
  coverImg: string;
};

function TechnicalEdit({ mode, id }: CreateContentProps) {
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [techSesh, setTechSesh] = useState<TechnicalSession>({
    name: "",
    document: "",
    coverImg: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(
          `${BASE_API_URL}/technical-sessions/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("Technical Sessions details fetched:", response.data);
        setTechSesh({
          name: response.name,
          document: response.document || "",
          coverImg: response.coverImg || "",
        });
        setEditDataFetched(true);
      } catch (error) {
        setEditDataFetched(true);

        toast({
          title: "Technical Sessions not found",
          description: "Technical Sessions not found",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Technical Sessions details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, toast, mode]);

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      name: techSesh.name,
      document: techSesh.document,
      coverImg: techSesh.coverImg,
      status: status,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/technical-sessions/${id}`
          : `${BASE_API_URL}/technical-sessions`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      const response = await apiClient.request(config);
      console.log("Technical Sessions submitted successfully:", response);
      setIsSubmitting(false);
      toast({
        title: "Technical Sessions submitted successfully!",
        description: response.message,
        variant: "default",
      });
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Error submitting Technical Sessions",
        description: "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      <div>
        <InputEle
          label="Tecnical Session Title"
          type="text"
          id="name"
          value={techSesh.name}
          onChange={(e) => setTechSesh({ ...techSesh, name: e.target.value })}
        />
        <InputEle
          label="Upload Cover Image"
          type="images"
          id="coverImg"
          value={techSesh.coverImg}
          onChange={(e) =>
            setTechSesh({ ...techSesh, coverImg: e.target.value })
          }
        />

        <InputEle
          label="Upload File (PDF)"
          type="file"
          id="document"
          value={techSesh.document}
          onChange={(e) =>
            setTechSesh({ ...techSesh, document: e.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Technical Session"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
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
        <PreviewTechnical
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          name={techSesh.name}
          document={techSesh.document}
          coverImg={techSesh.coverImg}
        />
      )}
    </div>
  );
}

export default TechnicalEdit;
