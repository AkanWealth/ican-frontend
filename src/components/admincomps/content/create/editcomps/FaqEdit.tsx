"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import apiClient from "@/services-admin/apiClient";

import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

type Faq = {
  question: string;
  answer: string;
};
import PreviewFaq from "../previewcomps/PreviewFaq";

function FaqEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);

  const [faq, setFaq] = useState<Faq>({ question: "", answer: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiClient.get(`${BASE_API_URL}/faqs/${id}`);
        console.log("Faq details fetched:", response.data);
        setFaq({
          question: response.name,
          answer: response.answer || "",
        });
        setEditDataFetched(true);
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error fetching Faq:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching the Faq.",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching FAQ details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

  const handleSubmit = async (status: "published" | "draft") => {
    if (!faq.question || !faq.answer) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    const data = JSON.stringify({
      name: faq.question,
      answer: faq.answer,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit" ? `${BASE_API_URL}/faqs/${id}` : `${BASE_API_URL}/faqs`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      const response = await apiClient.request(config);
      console.log("FAQ submitted successfully:", response);
      toast({
        title: "Success",
        description: `FAQ ${
          mode === "edit" ? "edited" : "created"
        } successfully.`,
        variant: "default",
      });
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while submitting the FAQ.`,
        variant: "destructive",
      });
      window.location.reload();
    }
  };

  return (
    <div>
      <div>
        <InputEle
          label="Question"
          type="text"
          id="title"
          required={true}
          placeholder="Enter Question"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />
        <InputEle
          label="Answer"
          type="text"
          id="answer"
          required={true}
          placeholder="Enter Answer"
          value={faq.answer}
          onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish FAQ"}
        </button>
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            handleSubmit("draft");
          }}
          className=" py-2 text-primary border border-primary text-base rounded-full w-full"
        >
          {mode === "edit" ? "Save Edit" : "Save as Draft"}
        </button>
        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
      {showPreview && (
        <PreviewFaq
          question={faq.question}
          answer={faq.answer}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
    </div>
  );
}

export default FaqEdit;
