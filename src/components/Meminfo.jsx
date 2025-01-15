import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MdOutlineSupervisorAccount,
  MdOutlineMarkEmailRead,
  MdOutlineCheckBox,
  MdOutlinePayments,
  MdPeopleOutline,
  MdOutlineCleanHands,
  MdOutlineTimer,
  MdOutlineGroupAdd,
} from "react-icons/md";

function Meminfo({ toggle = false }) {
  if (toggle) {
    return (
      <div className=" flex flex-row p-4 md:p-20 lg:px-40  gap-8 w-auto items-center justify-between ">
        <div className="flex flex-col gap-12 max-w-[470px] text-left">
          <div>
            <p className="text-base font-semibold text-black">
              Ican Surulere District
            </p>
            <h1 className="text-primary text-5xl w-fit">
              Achievements and Milestones
            </h1>
          </div>
          <div className="flex flex-col gap-6 justify-center items-start h-fit w-fit">
            {/* fill according to BA & copy writers design */}
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdPeopleOutline className="w-12 h-12 bg-[#feebc4] fill-[#916103] p-1 rounded-sm" />
                <h5>Growing Membership</h5>
              </div>
              <p>
                With over 1,300 members, we proudly represent a thriving
                community of professionals committed to accounting excellence.
              </p>
            </div>
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlineCleanHands className="w-12 h-12 bg-[#feebc4] fill-[#916103] p-1 rounded-sm" />
                <h5>Community Impact</h5>
              </div>
              <p>
                Making a difference in over 20 communities, we champion
                impactful initiatives to empower and uplift the accounting
                industry.
              </p>
            </div>
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlineTimer className="w-12 h-12 bg-[#feebc4] fill-[#916103] p-1 rounded-sm" />
                <h5>Years of Dedication</h5>
              </div>
              <p>
                For 3 years, we have remained steadfast in delivering dedicated
                service to our members and stakeholders.
              </p>
            </div>
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlineGroupAdd className="w-12 h-12 bg-[#feebc4] fill-[#916103] p-1 rounded-sm" />
                <h5>Accelerating Growth</h5>
              </div>
              <p>
                Achieving a remarkable 30% yearly growth, we continue to expand
                our reach and influence in the financial sector.
              </p>
            </div>
          </div>
          <Link href="/sign-up">
            {/* Link to membership signup page */}
            <button className="bg-primary rounded-full py-3 px-8 w-full sm:w-fit hover:bg-blue-900 text-white">
              Become a Member
            </button>
          </Link>
        </div>
        <div className="hidden sm:flex">
          <Image
            alt="members"
            width={582}
            height={695}
            src={"/milestones.png"}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className=" flex flex-row p-4 md:p-20 lg:px-40  gap-8 w-auto items-center justify-between ">
        <div className="flex flex-col gap-12 max-w-[470px] text-left">
          <div>
            <p className="text-base font-semibold text-black">
              Ican Surulere District
            </p>
            <h1 className="text-primary font-bold text-5xl w-fit">
              How to Become a Member
            </h1>
          </div>
          <div className="flex flex-col gap-6 justify-center items-start h-fit w-fit">
            {/* fill according to BA & copy writers design */}
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlineSupervisorAccount className="w-12 h-12 bg-green-400 fill-white p-1 rounded-sm" />
                <h5>Click on “ Become a member”</h5>
              </div>
              <p>
                Enter your email address and password to receive a verification
                link
              </p>
            </div>
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlineMarkEmailRead className="w-12 h-12 bg-green-400 fill-white p-1 rounded-sm" />
                <h5>Verify Email</h5>
              </div>
              <p>
                Click on the verification link in your email and login in to
                complete registration
              </p>
            </div>
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlineCheckBox className="w-12 h-12 bg-green-400 fill-white p-1 rounded-sm" />
                <h5>Complete Registration</h5>
              </div>
              <p>
                Ensure to fill in all the necessary details. Don&apos;t worry,
                it is a simple process
              </p>
            </div>
            <div className="p-6 rounded-2xl h-fit outline-1 outline  flex flex-col gap-6 max-w-md ">
              <div className=" h-fit flex flex-row justify-start gap-2 items-center ">
                <MdOutlinePayments className="w-12 h-12 bg-green-400 fill-white p-1 rounded-sm" />
                <h5>Make Payments and wait for confirmation</h5>
              </div>
              <p>
                Choose a payment option and make payments. You will receive a
                confirmation email to enable you login as a member
              </p>
            </div>
          </div>
          <Link href="/sign-up">
            {/* Link to membership signup page */}
            <button className="bg-primary rounded-full py-3 px-8 w-full sm:w-fit hover:bg-blue-900 text-white">
              Become a Member
            </button>
          </Link>
        </div>
        <div className="hidden sm:flex">
          <Image alt="members" width={582} height={695} src={"/mem_how.png"} />
        </div>
      </div>
    );
  }
}

export default Meminfo;
