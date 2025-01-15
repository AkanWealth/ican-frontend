import React from "react";
import Heroimg from "@/components/Heroimg";
import Meminfo from "@/components/Meminfo";
// import Infocard from "@/components/genui/Infocard";
import Itemcard from "@/components/genui/Itemcard";
import Aims from "../../../components/Aims";
import {
  MdOutlineLightbulb,
  MdFamilyRestroom,
  MdBrightness5,
} from "react-icons/md";

function Aboutus() {
  return (
    <div>
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="About ICAN SDS"
        imageUrl="/aboutushero.png"
      >
        <></>
      </Heroimg>
      <div className="bg-white flex flex-col items-center gap-12 w-full p-4 md:p-20 lg:px-40">
        <h3 className="text-primary font-bold text-center text-4xl font-mono w-full">
          Shaping the Future of <br /> Accounting
        </h3>
        <div className="flex w-fit flex-col sm:flex-row  gap-12 justify-between">
          <div className="flex flex-col rounded-xl gap-6 bg-primary max-w-sm p-8 lg:px-8 lg:py-12 text-white">
            <h6 className=" text-xl font-medium   ">
              OUR MISSION
              <hr className="  border opacity-50 w-full border-gray-100   " />
            </h6>
            <p className="text-base">
              To produce world-class chartered accountants, regulate and
              continually enhance their ethical standards and technical
              competence in the public interest.
            </p>
          </div>
          <div className="flex flex-col rounded-xl gap-6 max-w-sm bg-green-200 text-black p-8">
            <h6 className=" text-xl font-medium  ">
              OUR VISION
              <hr className="  border opacity-50 w-full border-gray-100   " />
            </h6>
            <p className="text-base">
              To produce world-class chartered accountants, regulate and
              continually enhance their ethical standards and technical
              competence in the public interest.
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full p-4 sm:py-20 sm:px-40 bg-green-100 sm:bg-blue-100 flex flex-col items-center justify-center gap-16 ">
        <div className="flex flex-col w-fit items-center gap-2">
          <h4 className="text-primary font-mono text-2xl sm:text-5xl font-bold text-center">
            Our Values
          </h4>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-12 items-center justify-center">
          <Itemcard
            name={"Community"}
            info={"Fostering collaboration and unity among our members."}
            icon={<MdFamilyRestroom className="w-9 h-9 fill-primary" />}
            type="col"
            bg="bg-[#dce2f9]"
          />
          <Itemcard
            name={"Integrity"}
            info={
              "Upholding the highest ethical standards in all our endeavors."
            }
            icon={<MdOutlineLightbulb className="w-9 h-9 fill-primary" />}
            type="col"
            bg="bg-[#dce2f9]"
          />
          <Itemcard
            name={"Excellence"}
            info={
              "Striving for  quality in education, service, and professional growth of our members"
            }
            icon={<MdBrightness5 className="w-9 h-9 fill-primary" />}
            type="col"
            bg="bg-[#dce2f9]"
          />
        </div>
      </div>
      <Aims />
      <Meminfo toggle={true} />
    </div>
  );
}

export default Aboutus;
