"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import { RichTextEditor } from "@/registry/new-york/rich-text-editor/rich-text-editor";

import { useRouter } from "next/navigation";

import apiClient from "@/services-admin/apiClient";
import { uploadGalleryImage, validateGalleryImage } from "@/lib/galleryUpload";

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
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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
  const [blogErrors, setBlogErrors] = useState<BlogProps>({
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
        const response = await apiClient.get(`${BASE_API_URL}/blogs/${id}`, {
          withCredentials: true,
        });
        console.log("Blog details fetched:", response);
        setBlog({
          title: response.title,
          authorName: response.authorName || "",
          contentBody: response.contentBody || "",
          contentType: response.contentType || "",
          coverImage: response.coverImage || "",
          status: response.status || "",
        });
        setPost(response.contentBody);
        setEditDataFetched(true);
        toast({
          title: "Blog details fetched successfully",
          description: "Blog details fetched successfully",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Error fetching Blog",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Blog details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, toast, id, mode]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate the file before uploading
    const validation = validateGalleryImage(file);
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    try {
      // Show loading state
      setIsUploading(true);
      setUploadProgress(0);

      // Create a unique folder path for advert images
      // Use the S3 upload function from galleryUpload.js but with an advert-specific path
      const uploadedUrl = await uploadGalleryImage(file, (progress) => {
        setUploadProgress(progress);
      });

      console.log("Uploaded blog image URL:", uploadedUrl);

      // Update state with the new URL
      setBlog((prev) => ({
        ...prev,
        coverImage: uploadedUrl,
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error uploading blog image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setBlog((prev) => ({
      ...prev,
      coverImage: "",
    }));
    toast({
      title: "Image removed",
      description: "The image has been removed from the blog.",
      variant: "default",
    });
  };

  // Validate blog data before submission
  const validateBlog = () => {
    // Initialize error messages object

    // Check title
    if (!blog.title.trim()) {
      setBlogErrors((prev) => ({
        ...prev,
        title: "Title is required",
      }));
    }

    // Check author name
    if (!blog.authorName.trim()) {
      setBlogErrors((prev) => ({
        ...prev,
        authorName: "Author name is required",
      }));
    }

    // Check content body
    if (!post.trim()) {
      toast({
        title: "Content body is required",
        description: "Content body is required",
        variant: "destructive",
      });
    }

    // Check cover image
    if (!blog.coverImage) {
      setBlogErrors((prev) => ({
        ...prev,
        coverImage: "Cover image is required",
      }));
    }

    // If there are any errors, show toast messages and return false

    return true;
  };

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      title: blog.title,
      authorName: blog.authorName,
      contentBody: post,
      contentType: "article",
      coverImage: blog.coverImage,
    });

    if (!validateBlog()) return;

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/blogs/${id}`
          : `${BASE_API_URL}/blogs`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: data,
    };

    try {
      const response = await apiClient.request(config);
      console.log("Blog submitted successfully:", response);
      toast({
        title: "Blog submitted successfully!",
        description: "Blog submitted successfully!",
        variant: "default",
      });
      setIsSubmitting(false);
      setIsLoading(false);
      router.refresh();
    } catch (error: any) {
      setIsSubmitting(false);
      setIsLoading(false);
      toast({
        title: "Error submitting blog",
        description:
          error.response?.data?.message ||
          error?.message ||
          "An unknown error occurred",
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
          required={true}
          errorMsg={blogErrors.title}
        />
        <InputEle
          label="Author Name"
          type="text"
          id="authorName"
          value={blog.authorName}
          onChange={(e) => setBlog({ ...blog, authorName: e.target.value })}
          required={true}
          errorMsg={blogErrors.authorName}
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Blog Cover Image</label>

          {/* Image Upload Controls */}
          <div className="flex flex-wrap gap-4">
            <label className="bg-[#27378C] text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 text-sm whitespace-nowrap">
              Upload Blog Image <span className="text-red-600">*</span>
              <input
                type="file"
                required={true}
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {blog.coverImage && (
              <button
                onClick={handleDeleteImage}
                className="bg-[#E7EAFF] text-[#27378C] px-6 py-2 rounded-full hover:bg-gray-200 text-sm whitespace-nowrap"
                disabled={isUploading}
              >
                Remove Image
              </button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">
                Uploading... {uploadProgress}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Preview */}
          {blog.coverImage && !isUploading && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-2">Image Preview</p>
              <div className="relative group w-full max-w-md">
                <img
                  src={blog.coverImage}
                  alt="Blog preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <h5 className="text-base font-sans font-semibold">Content Body</h5>

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
