import React from "react";
import Image from "next/image";
import { MdContentCopy } from "react-icons/md";

function PaymentInfo() {
  return (
    <div
      id="payment"
      className=" p-4 sm:p-20 lg:p-40 bg-white flex flex-col sm:flex-row gap-6 justify-between items-center w-full h-fit "
    >
      <Image
        height={530}
        width={400}
        className="w-full h-auto rounded-2xl max-w-[550px]"
        alt="Payment"
        src="/Payment.png"
      />{" "}
      <div className="flex flex-col sm:w-[550px] gap-12 items-start text-left">
        <div className="gap-4 w-fit text-left">
          <h2 className="text-primary w-fit font-semibold text-4xl sm:text-5xl font-mono">
            Membership Payment
          </h2>
        </div>
        <p className="text-sans font-normal text-base text-gray-600 text-justify">
          You can make your payment via cash deposit or direct transfer using
          the account details below:
        </p>
        <div className="w-1/2 flex flex-col">
          <h4 className="font-semibold">FEES </h4>
          <p className="text-base font-normal font-sans">
            Registration Fee: <span className="font-semibold">₦10,000</span>
          </p>
          <p className="text-base font-normal font-sans">
            Annual Dues: <span className="font-semibold">₦10,000</span>
          </p>
        </div>
        <div className="w-1/2 flex flex-col gap-3">
          <h4 className="font-semibold">ACCOUNT DETAILS </h4>
          <Image width={137} height={37} src={"/first.png"} alt="First Bank" />
          <p className="text-base font-normal text-neutral-700 font-sans">
            Account Number
          </p>
          <p className="text-base font-normal font-sans flex flex-row gap-4 items-center">
            <span className="font-semibold text-2xl">2045417438</span>{" "}
            <MdContentCopy className="w-5 h-5 " />{" "}
          </p>
          <p className="text-base font-normal text-neutral-700 font-sans">
            Account Name
          </p>
          <p className="text-base font-normal font-sans flex flex-row gap-4 items-center">
            <span className=" whitespace-nowrap font-semibold text-2xl">
              ICAN Surulere & District Society
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentInfo;
