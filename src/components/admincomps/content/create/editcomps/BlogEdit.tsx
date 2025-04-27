"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import { RichTextEditor } from "@/registry/new-york/rich-text-editor/rich-text-editor";

import { useRouter } from "next/navigation";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import PreviewBlog from "../previewcomps/PreviewBlog";
import { useToast } from "@/hooks/use-toast";

interface BlogProps {
  title: string;
  authorName: string;
  contentBody: string;
  contentType: string;
  coverImage: string;
  status: string;
}

function BlogEdit({ mode, id }: CreateContentProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { toast } = useToast();

  const [blog, setBlog] = useState<BlogProps>({
    title: "",
    authorName: "",
    contentBody: "",
    contentType: "",
    coverImage: "",
    status: "",
  });
  const [post, setPost] = useState("");
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/blogs/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        });
        console.log("Advert details fetched:", response.data);
        setBlog({
          title: response.data.title,
          authorName: response.data.authorName || "",
          contentBody: response.data.contentBody || "",
          contentType: response.data.contentType || "",
          coverImage: response.data.coverImage || "",
          status: response.data.status || "",
        });
        setPost(response.data.contentBody);
        setEditDataFetched(true);
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 404
        ) {
          setEditDataFetched(true);
          toast({
            title: "Blog not found",
            description: error.response.data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error fetching Blog",
            description:
              axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "An unknown error occurred",
            variant: "destructive",
          });
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Blog details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, toast, id, mode]);

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      title: blog.title,
      authorName: blog.authorName,
      contentBody: post,
      contentType: "article",
      coverImage: "",
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/blogs/${id}`
          : `${BASE_API_URL}/blogs`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Blog submitted successfully:", response.data);
      setIsSubmitting(false);
      setIsLoading(false);
      router.refresh();
      toast({
        title: "Blog submitted successfully!",
        description: response.data.message,
        variant: "default",
      });
    } catch (error) {
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Error submitting blog",
        description:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <form>
      <div>
        <InputEle
          label="Title"
          type="text"
          id="title"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
        />
        <InputEle
          label="Author Name"
          type="text"
          id="authorName"
          value={blog.authorName}
          onChange={(e) => setBlog({ ...blog, authorName: e.target.value })}
        />
        <div>
          <h5>Content Body</h5>

          <RichTextEditor value={post} onChange={setPost} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          disabled={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setIsLoading(true);
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Blog"}
        </button>
        <button
          disabled={isSubmitting}
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
        <PreviewBlog
          title={blog.title}
          authorName={blog.authorName}
          contentBody={post}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        />
      )}
    </form>
  );
}

export default BlogEdit;
