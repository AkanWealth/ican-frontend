import Heroimg from "@/components/Heroimg";
import Meminfo from "@/components/Meminfo";
import React from "react";
import Faq from "@/components/Faq";
import Infocard from "@/components/genui/Infocard";

function Howiw() {
  return (
    <div className="flex flex-col items-center ">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="How it works"
        imageUrl="/howiwhero.png"
      />

      <Meminfo />
      <Infocard
        subtitle={"ICAN SURULERE DISTRICT"}
        title="Benefits of Being a Member"
        addtxt={
          "As a valued member of our ICAN District Society, you gain access to:"
        }
      />

      <Faq />
    </div>
  );
}

export default Howiw;
