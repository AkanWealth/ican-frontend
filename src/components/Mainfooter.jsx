import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";
import { FaInstagram, FaMeta, FaTwitter, FaPhone } from "react-icons/fa6";

function Mainfooter() {
  return (
    <footer>
      <div className="h-fit w-full px-20 py-20 bg-primary flex-col justify-start items-center gap-20 inline-flex">
        <div className="self-stretch justify-between items-start inline-flex">
          <div className="w-80 self-stretch flex-col justify-center items-start gap-8 inline-flex">
            <div className="self-stretch h-28 flex-col justify-start items-start gap-2 flex">
              <div className="justify-start items-start gap-4 inline-flex">
                <Image
                  alt="Logo"
                  loading="lazy"
                  width={145}
                  height={60}
                  src="/Logo_small.png"
                />
              </div>
              <p className="self-stretch text-white text-base font-normal   leading-tight">
                Tertiary institution as accredited by the Institute of Chartered
                Accountants of Nigeria
              </p>
            </div>
            <div className="self-stretch h-16 flex-col justify-start items-start gap-1 flex">
              <div className="justify-center items-center gap-2 inline-flex">
                <HiOutlineLocationMarker className=" stroke-white w-8 h-8 relative" />
                <p className="text-white text-sm font-normal   leading-tight">
                  Office Address
                </p>
              </div>
              <p className="self-stretch text-white text-sm font-medium ">
                30B, Oke-Onijo Street, Off Ogunlana Street,
                <br />
                Ijeshatedo, Surulere, Lagos
              </p>
            </div>
          </div>
          <div className="justify-start items-start gap-10 flex">
            <div className="w-fit flex-col justify-start items-start gap-4 inline-flex">
              <h5 className="w-fit text-white text-base font-bold   leading-tight">
                Page
              </h5>
              <div className="flex-col justify-start items-start gap-4 flex">
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  About
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Contact Us
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Membership
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Donations
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Excos
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  ICAN Website
                </Link>
              </div>
            </div>
            <div className="w-fit flex-col justify-start items-start gap-4 inline-flex">
              <h5 className="w-fit h-7 text-white text-base font-bold   leading-tight">
                Resources
              </h5>
              <div className="flex-col justify-start items-start gap-4 flex">
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  News
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Events
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Gallery
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Blog
                </Link>
                <Link href="/" className="text-gray-300 text-sm font-normal ">
                  Jobs
                </Link>
              </div>
            </div>
            <div className="w-fit flex-col justify-start items-start gap-4 inline-flex">
              <h5 className="w-28 h-7 text-white text-base font-bold   leading-tight">
                Contact
              </h5>
              <div className="self-stretch h-32 flex-col justify-start items-start gap-3 flex">
                <div className="self-stretch justify-start items-center gap-1.5 inline-flex">
                  <HiOutlineMail className="w-6 h-6 stroke-white relative" />
                  <br />
                  <p className="grow w-fit shrink basis-0 text-gray-300 text-sm font-normal text-wrap">
                    icansuruleredistrictsociety@gmail.com
                  </p>
                </div>
                <div className="self-stretch justify-start items-center gap-1.5 inline-flex">
                  <FaPhone className=" stroke-white fill-white w-6 h-6 relative" />
                  <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                    <p className="text-gray-300 text-sm font-normal ">
                      +234 808 816 8895
                    </p>
                    <p className="text-gray-300 text-sm font-normal ">
                      +234 803 256 4245
                    </p>
                  </div>
                </div>
                <div className="self-stretch justify-start items-center gap-6 inline-flex">
                  <FaInstagram className="stroke-white fill-white w-8 h-8 relative" />
                  <FaTwitter className="stroke-white fill-white w-8 h-8 relative" />
                  <FaMeta className=" stroke-white fill-white w-8 h-8 relative" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch justify-center items-center gap-4 flex">
          <p className="text-gray-300 text-sm font-normal ">
            Copyright © 2024 Surulere & District Society All Rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Mainfooter;