"use client";

import Heroimg from "@/components/homecomps/Heroimg";
import React from "react";
import Faq from "@/components/homecontent/Faq";
import StudentStudy from "@/components/homecontent/StudentStudy";

function Student() {
  return (
    <div className="flex flex-col items-center ">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Student"
        imageUrl="/studenthero.png"
      />
      <StudentStudy />

      <Faq />
    </div>
  );
}

export default Student;
