import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PreviewFaqProps {
  question: string;
  answer: string;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
}

function PreviewFaq({
  question,
  answer,
  showPreview,
  setShowPreview,
}: PreviewFaqProps) {
  return (
    <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Preview FAQ</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className=" p-4  sm:p-20 lg:px-40 bg-green-100   sm:bg-[url('/faqbg.png')] bg-no-repeat bg-cover w-full ">
          <div className=" bg-transparent sm:bg-primary flex flex-col gap-6 w-full  sm:p-8 md:p-16 lg:px-64 rounded-[50px] sm:text-white">
            <h3 className=" text-primary sm:text-white font-bold font-mono text-2xl md:text-3xl lg:text-5xl text-center  ">
              Frequently Asked Questions
            </h3>
            <div className=" flex flex-col text-black rounded-2xl py-6 px-6 sm:p-0  sm:text-white gap-4 bg-white sm:bg-transparent ">
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${question}`}>
                  <AccordionTrigger className=" text-lg">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className=" flex flex-col gap-2">
                    <p className="text-base">{answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewFaq;
