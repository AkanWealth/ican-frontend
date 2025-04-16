"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";


function Faq() {
  const [faqs, setFaqs] = useState([]); // State to store FAQ data from API

  useEffect(() => {
    async function fetchFAQData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/faqs`,
        headers: {},
      };
      try {
        const response = await axios.request(config);
        setFaqs(response.data.faqs);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFAQData();
  }, []);

  return (
    <div className=" p-4  sm:p-20 lg:px-40 bg-green-100   sm:bg-[url('/faqbg.png')] bg-no-repeat bg-cover w-full ">
      <div className=" bg-transparent sm:bg-primary flex flex-col gap-6 w-full  sm:p-8 md:p-16 lg:px-64 rounded-[50px] sm:text-white">
        <h3 className=" text-primary sm:text-white font-bold font-mono text-2xl md:text-3xl lg:text-5xl text-center  ">
          Frequently Asked Questions
        </h3>
        <div className=" flex flex-col text-black rounded-2xl py-6 px-6 sm:p-0  sm:text-white gap-4 bg-white sm:bg-transparent ">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={role.id} value={`item-${role.id}`}>
                <AccordionTrigger className=" text-lg">
                  {faq.name}
                </AccordionTrigger>
                <AccordionContent className=" flex flex-col gap-2">
                  <p className="text-base   ">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className=" flex flex-row justify-center gap-2 items-center ">
            <p className=" text-xs sm:text-sm sm:whitespace-nowrap w-fit">
              My question is not here.
            </p>
            <Link href="/contact-us">
              <button className="w-fit rounded-lg whitespace-nowrap py-2 px-5 text-sm sm:py-4 sm:px-8 sm:text-base bg-primary sm:bg-white text-white sm:text-primary font-sans">
                Connect with us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Faq;
