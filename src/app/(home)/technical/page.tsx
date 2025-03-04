"use client";

import Heroimg from "@/components/Heroimg";
import React from "react";
import TechnicalSect from"@/components/pubntech/TechnicalSect"
import Faq from "@/components/Faq";
import StudentStudy from "@/components/StudentStudy";


function Technical() {
  return (  
    <div className="flex flex-col items-center ">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Technical Sessions"
        imageUrl="/techhero.png"
      />
      <TechnicalSect />

    </div>
  )
}

export default Technical