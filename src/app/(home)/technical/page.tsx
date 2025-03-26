"use client";

import Heroimg from "@/components/homecomps/Heroimg";
import React from "react";
import TechnicalSect from "@/components/pubntech/TechnicalSect";


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
  );
}

export default Technical;
