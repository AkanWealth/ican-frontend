"use client";

import Heroimg from "@/components/Heroimg";
import React from "react";
import Faq from "@/components/Faq";
import StudentStudy from "@/components/StudentStudy";

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
