import React from "react";
import Heroimg from "@/components/homecomps/Heroimg";
import Meminfo from "@/components/homecomps/Meminfo";
// import Infocard from "@/components/genui/Infocard";
import Itemcard from "@/components/genui/Itemcard";
import Aims from "@/components/homecomps/Aims";
import {
  MdOutlineLightbulb,
  MdFamilyRestroom,
  MdBrightness5,
  MdFlipCameraAndroid,
} from "react-icons/md";

function Aboutus() {
  return (
    <div>
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="About Surulere and District Society (SDS)"
        imageUrl="/aboutushero.png"
      >
        <></>
      </Heroimg>
      <div className="bg-white flex flex-col items-center gap-12 w-full p-4 md:p-20 lg:px-40">
        <h3 className="text-primary font-bold text-center text-3xl sm:text-4xl font-mono w-full">
          Shaping the Future of <br /> Accounting
        </h3>
        <div className="flex flex-col items-center gap-0">
          <h5 className="font-semibold font-sans text-xl">Slogan </h5>
          <h4 className=" font-mono text-primary font-bold text-2xl ">
            All-Star District
          </h4>
        </div>
        <div className="flex w-fit flex-col sm:flex-row  gap-12 justify-between">
          <div className="flex flex-col rounded-xl gap-6 bg-[#C1EBCD] max-w-sm p-8 lg:px-8 lg:py-12 text-black">
            <h6 className=" text-xl font-medium">
              OUR VISION
              <hr className="border opacity-50 w-full border-[#36A757]  my-4" />
            </h6>
            <p className="text-base">
              To be a foremost District Society of ICAN and home to shining
              stars in the accounting profession
            </p>
          </div>
          <div className="flex flex-col rounded-xl gap-6 bg-primary max-w-sm p-8 lg:px-8 lg:py-12 text-white">
            <h6 className=" text-xl font-medium">
              OUR MISSION
              <hr className="border opacity-50 w-full border-gray-100 my-4" />
            </h6>
            <p className="text-base">
              To provide an incubation and nurturing centre for professional
              excellence in young and vibrant accountants
            </p>
          </div>
        </div>
      </div>

      {/* <div className=" w-full p-4 sm:py-20 sm:px-40 flex flex-col items-center justify-center gap-16 bg-[#E0F5E6]">
        <div className="flex flex-col w-fit items-center gap-2">
          <h4 className="text-primary font-mono text-2xl sm:text-5xl font-bold text-center">
            Our Core Values
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center justify-center">
          <Itemcard
            name={"Discipline"}

          
            info={
              "Members maintain self-control and adhere to ethical and professional standards"
            }
            icon={<MdBrightness5 className="w-9 h-9 fill-primary" />}

            type="col"
            size=" "
            bg="bg-[#dce2f9]"
          />
          <Itemcard
            name={"Aspiration"}
            info={
              "Members have the mindset of growth in career, business and family"
            }
            icon={<MdOutlineLightbulb className="w-9 h-9 fill-primary" />}
            type="col"
            size=" "
            bg="bg-[#dce2f9]"
          />
          <Itemcard
            name={"Agility"}
            info={
              "Members experiment, learn from failures and iterate on successes quickly and efficiently"
            }
            icon={<MdFamilyRestroom className="w-9 h-9 fill-primary" />}
            type="col"
            size=" "
            bg="bg-[#dce2f9]"
          />
          <Itemcard
            name={"Synergy"}
            info={"Members collaborate and unite for collective success."}
            icon={<MdFlipCameraAndroid className="w-9 h-9 fill-primary" />}
            type="col"
            size=" "
            bg="bg-[#dce2f9]"
          />
        </div>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4 md:p-40 bg-[#d9f5e3] rounded-lg">
        <h4 className="text-2xl font-bold text-center col-span-1 sm:col-span-2 text-primary font-mono  sm:text-5xl">
          Our Core Values
        </h4>

        <div className="bg-white  rounded-lg shadow-md p-6 border border-dotted border-[#dce2f9] flex flex-col items-start">
          <div className="mb-4 bg-[#dce2f9] rounded-full p-2">
            <MdBrightness5 className="w-8 h-8 fill-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Discipline</h3>
          <p className="text-base text-gray-600">
            Members maintain self-control and adhere to ethical and professional
            standards
          </p>
        </div>

        <div className="bg-white  rounded-lg shadow-md p-6 border border-dotted border-[#dce2f9] flex flex-col items-start">
          <div className="mb-4 bg-[#dce2f9] rounded-full p-2">
            <MdOutlineLightbulb className="w-8 h-8 fill-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Aspiration</h3>
          <p className="text-base text-gray-600">
            Members have the mindset of growth in career, business and family
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-dotted border-[#dce2f9] flex flex-col items-start">
          <div className="mb-4 bg-[#dce2f9] rounded-full p-2">
            <MdFamilyRestroom className="w-8 h-8 fill-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Agility</h3>
          <p className="text-base text-gray-600">
            Members experiment, learn from failures and iterate on successes
            quickly and efficiently
          </p>
        </div>

        <div className="bg-white  rounded-lg shadow-md p-6 border border-dotted border-[#dce2f9] flex flex-col items-start">
          <div className="mb-4 bg-[#dce2f9] rounded-full p-2">
            <MdFlipCameraAndroid className="w-8 h-8 fill-primary" />
          </div>
          <h3 className="font-semibold text-xl mb-2">Synergy</h3>
          <p className="text-base text-gray-600">
            Members collaborate and unite for collective success.
          </p>
        </div>
      </div>
      <Aims />
      {/* <Meminfo toggle={true} /> */}
    </div>
  );
}

export default Aboutus;
