import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";

type Advert = {
  name: string;
  image: string;
  textBody: string;
  startDate: Date;
  endDate: Date;
};

function AdvertEdit() {
  const [advert, setAdvert] = useState<Advert>({
    name: "",
    image: "",
    textBody: "",
    startDate: new Date(),
    endDate: new Date(),
  });


  return (
    <div>
      <div>
        <InputEle
          label="Advert Title"
          type="text"
          id="title"
          value={advert.name}
          onChange={(e) => setAdvert({ ...advert, name: e.target.value })}
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
          value={advert.startDate.toISOString().split('T')[0]}
          onChange={(e) => setAdvert({ ...advert, startDate: new Date(e.target.value) })}
        />
        <InputEle
          label="End Date"
          type="date"
          id="end_date"
          value={advert.endDate.toISOString().split('T')[0]}
          onChange={(e) => setAdvert({ ...advert, endDate: new Date(e.target.value) })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <button className="rounded-full py-2 bg-primary text-white text-base w-full">
          Publish Advert
        </button>
        <button className=" py-2 text-primary border border-primary text-base rounded-full w-full">
          Save as Draft
        </button>
        <button className=" py-1 text-primary text-base rounded-full w-full">
          Preview
        </button>
      </div>
    </div>
  );
}

export default AdvertEdit;
