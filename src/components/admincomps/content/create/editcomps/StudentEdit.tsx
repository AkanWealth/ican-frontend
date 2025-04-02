"use client";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import Toast from "@/components/genui/Toast";

type StudyPack = {
  name: string;
  document: string;
};

function StudentEdit({ mode, id }: CreateContentProps) {
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);
  const [student, setStudent] = useState<StudyPack>({ name: "", document: "" });

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
        } else {
          console.error("Error fetching Study Pack:", error);
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Study Pack details for edit mode");
      fetchDetails();
    }
  }, []);

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
      return (
        <Toast type="success" message="Study Pack submitted successfully!" />
      );
    } catch (error) {
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
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Study Packs"}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
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

export default StudentEdit;
