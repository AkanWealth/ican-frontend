import React, { useState } from "react";
import InputEle from "@/components/genui/InputEle";

type Faq = {
  question: string;
  answer: string;
};

function FaqEdit() {
  const [faq, setFaq] = useState<Faq>({ question: "", answer: "" });
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
        <button className="rounded-full py-2 bg-primary text-white text-base w-full">
          Publish FAQ
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

export default FaqEdit;
