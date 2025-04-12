import React from "react";
import Heroimg from "@/components/homecomps/Heroimg";
import Getin from "@/components/homecomps/Getin";
import Cinfo from "@/components/homecomps/Cinfo";
import Findus from "@/components/homecomps/Findus";

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
