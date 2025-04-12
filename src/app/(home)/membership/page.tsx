import React from "react";
import Heroimg from "@/components/Heroimg";
import Meminfo from "@/components/Meminfo";
import Infocard from "@/components/genui/Infocard";
import Link from "next/link";
import PaymentInfo from "@/components/PaymentInfo";
// import Cta from "@/components/Cta";
// import Dues from "@/components/Dues";

function Membership() {
  return (
    <>
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Member Benefits"
        imageUrl="/memberhero.png"
      >
        <div className="flex gap-12 flex-row justify-center mt-4">
          <Link href={"/sign-up"}>
            <button className="  text-white rounded-full bg-secondary py-3 px-8 w-fit hover:bg-green-900 ">
              Become a Member
            </button>
          </Link>
          <Link href={"/login"}>
            <button className=" outline-1 outline-white text-primary rounded-full bg-blue-100 hover:bg-blue-500 hover:text-white py-3 px-8  w-fit">
              Login as Member
            </button>
          </Link>
        </div>
      </Heroimg>
      <Meminfo />
      <PaymentInfo />
      <Infocard
        subtitle={"SURULERE & DISTRICT SOCIETY (SDS)"}
        title="Benefits of Being a Member"
        addtxt={
          "As a valued member of our District Society, you gain access to:"
        }
      />
      {/* <Dues />

      <Cta toggle={false} /> */}
    </>
  );
}

export default Membership;
