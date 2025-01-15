import React from "react";
import Image from "next/image";
import Reason from "./genui/Reason";

function Aims() {
  // Aims tags and info
  return (
    <div className="flex flex-col lg:px-40 md:p-20 p-4 gap-8 w-full justify-between items-center ">
      <h2 className=" text-5xl font-bold text-primary font-mono text-left  ">
        Why You Should Join the Surulere & District Society (SDS)
      </h2>
      <Image
        width={462}
        height={694}
        alt="Aims"
        className="hidden w-full sm:flex"
        src={"/aims_banner.png"}
      />
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 items-center justify-center ">
        <Reason
          name="A Vibrant Community"
          info="Be part of a district filled with young, dynamic chartered accountants and seasoned professionals who nurture and guide the next generation."
        />{" "}
        <Reason
          name="Exclusive Sponsorship Opportunities"
          info="Be part of a district filled with young, dynamic chartered accountants and seasoned professionals who nurture and guide the next generation."
        />{" "}
        <Reason
          name="Free Trainings on Contemporary Topics"
          info="Stay ahead with regular, no-cost sessions addressing industry-relevant issues."
        />{" "}
        <Reason
          name="Easy MCPD Credit Hours"
          info="Gain compulsory credit units quickly—two credits per meeting training session."
        />{" "}
        <Reason
          name="Holistic Mentorship"
          info="Benefit from comprehensive guidance tailored for young accountants to navigate their careers."
        />{" "}
        <Reason
          name="Job Opportunities"
          info="Stay updated with curated job vacancies shared on our dedicated platforms."
        />{" "}
        <Reason
          name="Robust Welfare Programs"
          info="Enjoy diverse welfare initiatives designed to support your personal and professional well-being."
        />{" "}
        <Reason
          name="Showcase Your Talents"
          info="Leverage platforms to highlight your unique skills and abilities."
        />
      </div>
    </div>
  );
}

export default Aims;
