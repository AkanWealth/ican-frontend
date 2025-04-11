import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import { CreateContentProps } from "@/libs/types";

import Toast from "@/components/genui/Toast";

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/technical-sessions/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            withCredentials: true,
          }
        );
        console.log("Technical Sessions details fetched:", response.data);
        setTechSesh({
          name: response.data.name,
          document: response.data.amswer || "",
          coverImg: response.data.coverImg || "",
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
            "Technical Sessions not found (404). Stopping further fetch attempts."
          );
        } else {
          console.error("Error fetching Technical Sessions:", error);
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching Technical Sessions details for edit mode");
      fetchDetails();
    }
  }, [editDataFetched, id, mode]);

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
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Technical Sessions submitted successfully:", response.data);
      return (
        <Toast
          type="success"
          message="Technical Sessions submitted successfully!"
        />
      );
    } catch (error) {
      console.error("Error submitting Technical Sessions:", error);
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
            handleSubmit("published");
          }}
          className="rounded-full py-2 bg-primary text-white text-base w-full"
        >
          {mode === "edit" ? "Publish Edit" : "Publish Technical Session"}
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

export default TechnicalEdit;
