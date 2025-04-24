"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

type Faq = {
  question: string;
  answer: string;
};

function FaqEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);

  const [faq, setFaq] = useState<Faq>({ question: "", answer: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/faqs/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        });
        console.log("Faq details fetched:", response.data);
        setFaq({
          question: response.data.name,
          answer: response.data.amswer || "",
        });
        setEditDataFetched(true);
        setIsSubmitting(false);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404
        ) {
          setEditDataFetched(true);
          console.error(
            "Faq not found (404). Stopping further fetch attempts."
          );
          toast({
            title: "Error",
            description:
              "Faq not found (404). Stopping further fetch attempts.",
            variant: "destructive",
          });
        } else {
          console.error("Error fetching Faq:", error);
          toast({
            title: "Error",
            description: "An error occurred while fetching the Faq.",
            variant: "destructive",
          });
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching FAQ details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode, toast]);

  const handleSubmit = async (status: "published" | "draft") => {
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
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("FAQ submitted successfully:", response.data);
      toast({
        title: "Success",
        description: `FAQ ${
          mode === "edit" ? "edited" : "created"
        } successfully.`,
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while submitting the FAQ.`,
        variant: "destructive",
      });

    }
  };

  return (
    <div>
      <div>
        <InputEle
          label="Question"
          type="text"
          id="title"
          placeholder="Enter Question"
          value={faq.question}
          onChange={(e) => setFaq({ ...faq, question: e.target.value })}
        />
        <InputEle
          label="Answer"
          type="text"
          id="answer"
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
    </div>
  );
}

export default FaqEdit;
