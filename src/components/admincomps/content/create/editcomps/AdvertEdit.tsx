"use state";

import React, { useState, useEffect } from "react";
import InputEle from "@/components/genui/InputEle";
import Cookies from "universal-cookie";
import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";

import { CreateContentProps } from "@/libs/types";
import { useRouter } from "next/navigation";
import Toast from "@/components/genui/Toast";
import { cookies } from "next/headers";

type Advert = {
  name: string;
  advertiser: string;
  image: string;

  textBody: string;
  startDate: Date;
  endDate: Date;
};

function AdvertEdit({ mode, id }: CreateContentProps) {
  const cookies = new Cookies();
  const [editDataFetched, setEditDataFetched] = useState<boolean>(false);

  const [advert, setAdvert] = useState<Advert>({
    name: "",
    image: "",
    advertiser: "",
    textBody: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/adverts/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          withCredentials: true,
        });
        console.log("Advert details fetched:", response.data);
        setAdvert({
          name: response.data.name || advert.name,
          advertiser: response.data.advertiser || advert.advertiser,
          image: response.data.image || advert.image,
          textBody: response.data.textBody || advert.textBody,
          startDate: response.data.startDate
            ? new Date(response.data.startDate)
            : advert.startDate,
          endDate: response.data.endDate
            ? new Date(response.data.endDate)
            : advert.endDate,
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
            "Advert not found (404). Stopping further fetch attempts."
          );
        } else {
          console.error("Error fetching Transactions:", error);
        }
      }
    };

    if (mode === "edit" && !editDataFetched) {
      console.log("Fetching transaction details for edit mode");
      fetchDetails();
    }
  }, []);

  const handleSubmit = async (status: "published" | "draft") => {
    const data = JSON.stringify({
      name: advert.name,
      advertiser: advert.advertiser,
      content: advert.textBody,
      startDate: advert.startDate.toISOString(),
      endDate: advert.endDate.toISOString(),
      coverImg: advert.image,
      status: status,
    });

    const config = {
      method: mode === "edit" ? "PATCH" : "POST",
      maxBodyLength: Infinity,
      url:
        mode === "edit"
          ? `${BASE_API_URL}/adverts/${id}`
          : `${BASE_API_URL}/adverts`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("Advert submitted successfully:", response.data);
      return <Toast type="success" message="Advert submitted successfully!" />;
    } catch (error) {
      console.error("Error submitting advert:", error);
    }
  };

  return (
    <form>
      <div>
        <InputEle
          label="Advert Title"
          type="text"
          id="name"
          value={advert.name}
          onChange={(e) => setAdvert({ ...advert, name: e.target.value })}
        />
        <InputEle
          label="Advertizer"
          type="text"
          id="advertiser"
          value={advert.advertiser}
          onChange={(e) => setAdvert({ ...advert, advertiser: e.target.value })}
        />
        <InputEle
          label="Advertisement Image"
          type="text"
          id="advert_image"
          value={advert.image}
          onChange={(e) => setAdvert({ ...advert, image: e.target.value })}
        />
        <InputEle
          label="Text Body"
          type="text"
          id="text_body"
          value={advert.textBody}
          onChange={(e) => setAdvert({ ...advert, textBody: e.target.value })}
        />
        <InputEle
          label="Start Date"
          type="date"
          id="start_date"
          value={advert.startDate.toISOString().split("T")[0]}
          onChange={(e) =>
            setAdvert({ ...advert, startDate: new Date(e.target.value) })
          }
        />
        <InputEle
          label="End Date"
          type="date"
          id="end_date"
          value={advert.endDate.toISOString().split("T")[0]}
          onChange={(e) =>
            setAdvert({ ...advert, endDate: new Date(e.target.value) })
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
          {mode === "edit" ? "Publish Edit" : "Publish Advert"}
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
    </form>
  );
}

export default AdvertEdit;
