import Heroimg from "@/components/homecomps/Heroimg";
import Meminfo from "@/components/homecomps/Meminfo";
import React from "react";
import Faq from "@/components/homecontent/Faq";
import Infocard from "@/components/genui/Infocard";

function Howiw() {
  return (
    <div className="flex flex-col items-center ">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="How It Works"
        imageUrl="/howiwhero.png"
      />

      <Meminfo />
      <Infocard
        subtitle={"SURULERE & DISTRICT SOCIETY (SDS)"}
        title="Benefits of Being a Member"
        addtxt={
          "As a valued member of our District Society, your attendance at our Physical Technical Sessions and Meetings provides you with access to:"
        }
      />

      <Faq />
    </div>
  );
}

export default Howiw;
