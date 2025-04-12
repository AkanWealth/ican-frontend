"use client";

import Heroimg from "@/components/Heroimg";
import React from "react";
import Faq from "@/components/Faq";
import StudentStudy from "@/components/StudentStudy";

function FaqPage() {
  return (
    <div className="flex flex-col items-center ">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="FAQ"
        imageUrl="/faqhero.png"
      />
      

      <Faq />
    </div>
  );
}

export default FaqPage;
