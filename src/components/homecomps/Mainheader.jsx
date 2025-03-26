"use client";

import React, { useState } from "react";
import {
  HiLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiMenu,
  HiX,
} from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Mainheader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="w-full h-fit sm:h-32 fixed top-0 z-50 bg-white flex-col justify-start items-start flex">
      <div className=" hidden  h-12 py-2 bg-primary flex-row justify-center items-center w-full gap-4 sm:flex">
        <div className="justify-start items-center gap-1  w-fit  flex">
          <HiOutlineMail className=" stroke-white " />
          <p className="text-white text-sm font-semibold   leading-none">
            icansuruleredistrictsociety@gmail.com
          </p>
        </div>
        <div className="w-fit justify-start items-center gap-1 flex">
          <HiOutlinePhone className=" stroke-white  " />
          <p className="text-white text-sm font-semibold   leading-none">
            +234 808 816 8895
          </p>
        </div>
        <div className="w-fit justify-start items-center gap-1 flex">
          <HiLocationMarker className=" stroke-white fill-white" />
          <p className="text-white text-sm font-normal leading-none">
            Surulere, Lagos, Nigeria
          </p>
        </div>
      </div>

      <div className=" w-full sm:w-full mt-4 p-2  justify-between sm:justify-around items-center sm:gap-10 flex flex-row">
        <Link href="/">
          <Image alt="Logo" width={184} height={60} src="/sdslogo.png" />
        </Link>
        <div className="hidden justify-start items-center gap-4 sm:flex">
          <NavigationMenu>
            <NavigationMenuList className=" gap-3">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className={`${
                    pathname === "/" ? "text-primary" : ""
                  } text-sm font-semibold   leading-none`}
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={` ${
                    pathname === "/about-us" ? "text-primary" : ""
                  } text-sm font-semibold w-fit leading-none`}
                >
                  About Us
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col mx-auto gap-5 p-4 md:w-[400px] lg:w-[500px] py-4 px-2  ">
                    {/* <Link href="/about-us/how-it-works" legacyBehavior passHref>
                      <NavigationMenuLink>How It Works</NavigationMenuLink>
                    </Link> */}
                    <Link href="/about-us" legacyBehavior passHref>
                      <NavigationMenuLink>About SDS</NavigationMenuLink>
                    </Link>
                    <Link href="/about-us/our-excos" legacyBehavior passHref>
                      <NavigationMenuLink>Our Excos</NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`${
                    pathname === "/membership" ? "text-primary" : ""
                  } text-sm font-semibold   leading-none`}
                >
                  Membership
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-5 p-4 md:w-[400px] lg:w-[500px] py-4 px-2  ">
                    <Link href="/membership" legacyBehavior passHref>
                      <NavigationMenuLink>Member Benefits</NavigationMenuLink>
                    </Link>
                    <Link href="/student" legacyBehavior passHref>
                      <NavigationMenuLink>Student</NavigationMenuLink>
                    </Link>
                    <Link href="/sign-up" legacyBehavior passHref>
                      <NavigationMenuLink>
                        Membership Registration
                      </NavigationMenuLink>
                    </Link>
                    <Link href="/login" legacyBehavior passHref>
                      <NavigationMenuLink>Member Login</NavigationMenuLink>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`${
                    pathname === "/gallery" ? "text-primary" : ""
                  } text-sm font-semibold   leading-none`}
                >
                  Media & Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex flex-col gap-5 p-4 md:w-[400px] lg:w-[500px] py-4 px-2  ">
                    {/* <Link href="/blog" legacyBehavior passHref>
                      <NavigationMenuLink>Blog </NavigationMenuLink>
                    </Link> */}
                    <Link href="/gallery" legacyBehavior passHref>
                      <NavigationMenuLink>Gallery</NavigationMenuLink>
                    </Link>
                    <Link href="/technical" legacyBehavior passHref>
                      <NavigationMenuLink>
                        Technical Session{" "}
                      </NavigationMenuLink>
                    </Link>
                    {/* 
                     <Link href="/publications" legacyBehavior passHref>
                      <NavigationMenuLink>Publication</NavigationMenuLink>
                    </Link> */}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/faq"
                  className={`${
                    pathname === "/faq" ? "text-primary" : ""
                  } text-sm font-semibold`}
                >
                  FAQ
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/contact-us"
                  className={`${
                    pathname === "/contact-us" ? "text-primary" : ""
                  } text-sm font-semibold`}
                >
                  Contact Us
                </Link>
              </NavigationMenuItem>

              <NavigationMenuIndicator />
            </NavigationMenuList>
            <NavigationMenuViewport className=" justify-self-center  " />
          </NavigationMenu>
        </div>
        <Link className="hidden sm:flex" href="/login">
          <button className="px-3 py-2 bg-primary rounded-2xl justify-center items-center gap-2 flex text-white text-sm font-semibold   leading-none">
            Member Login
          </button>
        </Link>

        {/* Nav bar links and menus */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex sm:hidden  "
        >
          {openMenu ? (
            <HiX className="stroke-black fill-black w-8 h-8 relative" />
          ) : (
            <HiMenu className="stroke-black fill-black w-8 h-8 relative" />
          )}
        </button>
      </div>
      <hr />
      <div
        className={` ${
          openMenu ? "flex flex-col w-full bg-white p-4 gap-4" : "hidden"
        } `}
      >
        <div className="p-4 flex flex-col gap-2">
          <Link
            onClick={() => setOpenMenu(!openMenu)}
            className={`${
              pathname === "/membership" ? "text-primary" : ""
            } text-sm font-semibold   leading-none`}
            href="/"
          >
            Home
          </Link>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>About us</AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                {/* <Link
                  onClick={() => setOpenMenu(!openMenu)}
                  href="/about-us/how-it-works"
                >
                  How It Works
                </Link> */}
                <Link onClick={() => setOpenMenu(!openMenu)} href="/about-us">
                  About ICAN SDS
                </Link>
                <Link
                  onClick={() => setOpenMenu(!openMenu)}
                  href="/about-us/our-excos"
                >
                  Our Excos
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Membership </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                <Link onClick={() => setOpenMenu(!openMenu)} href="/membership">
                  Member Benefits
                </Link>{" "}
                <Link onClick={() => setOpenMenu(!openMenu)} href="/student">
                  Student
                </Link>
                <Link onClick={() => setOpenMenu(!openMenu)} href="/sign-up">
                  Membership Registration
                </Link>
                <Link onClick={() => setOpenMenu(!openMenu)} href="/login">
                  Member Login
                </Link>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Media & Resources </AccordionTrigger>
              <AccordionContent className=" flex flex-col gap-2">
                {/* <Link onClick={() => setOpenMenu(!openMenu)} href="/blog">
                  Blog{" "}
                </Link>{" "} */}
                <Link onClick={() => setOpenMenu(!openMenu)} href="/gallery">
                  Gallery
                </Link>
                <Link onClick={() => setOpenMenu(!openMenu)} href="/technical">
                  Technical Session{" "}
                </Link>{" "}
                {/*
                 <Link onClick={() => setOpenMenu(!openMenu)} href="/publications">
                  Publications
                </Link>
                */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            onClick={() => setOpenMenu(!openMenu)}
            className={`${
              pathname === "/faq" ? "text-primary" : ""
            } text-sm font-semibold py-2  leading-none`}
            href="/faq"
          >
            FAQ
          </Link>
          <br />
          <Link
            onClick={() => setOpenMenu(!openMenu)}
            className={`${
              pathname === "/contact-us" ? "text-primary" : ""
            } text-sm font-semibold  py-2 leading-none`}
            href="/contact-us"
          >
            Contact Us
          </Link>
        </div>
        <Link className=" w-full " href="/login">
          <button className="px-8 py-4 bg-primary rounded-2xl justify-center items-center gap-2 flex text-white w-full text-sm font-semibold ">
            Member Login
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Mainheader;
