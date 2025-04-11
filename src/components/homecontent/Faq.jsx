"use client";

import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Faq() {
  return (
    <div className=" p-4  sm:p-20 lg:px-40 bg-green-100   sm:bg-[url('/faqbg.png')] bg-no-repeat bg-cover w-full ">
      <div className=" bg-transparent sm:bg-primary flex flex-col gap-6 w-full  sm:p-8 md:p-16 lg:px-64 rounded-[50px] sm:text-white">
        <h3 className=" text-primary sm:text-white font-bold font-mono text-2xl md:text-3xl lg:text-5xl text-center  ">
          Frequently Asked Questions
        </h3>
        <div className=" flex flex-col text-black rounded-2xl py-6 px-6 sm:p-0  sm:text-white gap-4 bg-white sm:bg-transparent ">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className=" text-lg">
                How do I register as a student with ICAN?
              </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                <p className="text-base   ">
                  You can become a member by passing the ICAN professional
                  examinations or through the Accounting Technicians Scheme of
                  West Africa (ATSWA) and applying for membership.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">
                How can I become a member of the Surulere & District Society
                (SDS)?
              </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                <p className=" text-base">
                  To join, you must first be an ICAN member. You can then
                  register with the Surulere District by contacting the district
                  office or visiting their official website for membership forms
                  and guidelines.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">
                How can I stay updated on events and activities in the District?{" "}
              </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                <p className=" text-base">
                  You can stay informed by subscribing to the district&apos;s
                  newsletter, following their social media accounts, or
                  regularly visiting their official website for announcements.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">
                How can I contact the Surulere District for further inquiries?{" "}
              </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                <p className="text-base ">
                  For more information, you can contact the Surulere District
                  office via their official email or phone number, or visit
                  their website&apos;s contact page.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg">
                Can non-members attend Surulere District events?{" "}
              </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                <p className="text-base ">
                  Some events and workshops are open to non-members, while
                  others may be exclusive to members. Check the district&apos;s
                  website or event announcements for specific details.
                </p>
              </AccordionContent>
            </AccordionItem>
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
