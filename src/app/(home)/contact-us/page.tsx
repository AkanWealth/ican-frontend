import React from "react";
import Heroimg from "@/components/Heroimg";
import Getin from "@/components/Getin";
import Cinfo from "@/components/Cinfo";
import Findus from "@/components/Findus";

function ContactUs() {
  return (
    <div>
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Contact Us"
        imageUrl="/contactushero.png"
      />
      <Getin heading={"GET IN TOUCH"} phoneNumber={true} className={""} />
      <Cinfo />
      <Findus />
    </div>
  );
}

export default ContactUs;
