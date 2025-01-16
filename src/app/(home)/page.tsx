"use client";

import Heroimg from "../../components/Heroimg";
import Cta from "../../components/Cta";
import Stories from "../../components/Stories";
import Gallery from "../../components/Gallery";
import Adverts from "../../components/Adverts";
import Speech from "../../components/Speech";

import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col items-center ">
        <Heroimg
          imageUrl="/Gallery1.jpg"
          maintxt={"Empowering Professionals, Building Futures"}
          subtxt={
            "Join Surulere & District Society (SDS) and unlock the benefits of a thriving professional community."
          }
        >
          <div className="flex sm:gap-12 w-full flex-row justify-around items-center mt-4">
            <Link href={"/sign-up"}>
              <button className=" h-fit sm:text-white rounded-full bg-secondary p-2 sm:py-3 sm:px-8 w-fit whitespace-nowrap hover:bg-green-500 ">
                Become a Member
              </button>
            </Link>
            <Link href={"/about-us"}>
              <button className=" h-fit  border  border-primary sm:border-white text-primary sm:text-white rounded-full bg-transparent hover:bg-blue-100 hover:text-black p-2 sm:py-3 sm:px-8  w-fit">
                Learn more
              </button>
            </Link>
          </div>
        </Heroimg>
        <Speech />
        <div className="hidden sm:block">
          <Gallery />
        </div>
        <Stories />
        <Adverts />
        <Cta />
      </main>
    </div>
  );
}
