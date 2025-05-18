import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const Heroimg = ({
  toggle = false,
  maintxt = "",
  subtxt = "",
  children = <></>,
  imageUrl = "",
}) => {
  return (
    <div
      className={`flex ${
        toggle ? "text-black sm:text-white" : "text-white  "
      }  rounded-b-3xl sm:rounded-none flex-col sm:flex-row  p-4 sm:py-20 lg:px-40 mt-32  gap-6 justify-center sm:justify-between items-center w-full  h-fit min-h-80 sm:min-h-[500px] sm:bg-none bg-gradient-to-b from-[#ffffff] to-[#c8d1fa] sm:bg-primary
      `}
      style={{
        backgroundImage: toggle ? "" : `url(${imageUrl})`,
        backgroundSize: "cover",
      }}
    >
      {/* Background Image Layer */}

      {/* Mobile Gradient Background */}

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col max-w-lg gap-6">
        <h1 className="text-left max-w-3xl text-4xl sm:text-6xl font-bold font-mono leading-20">
          {maintxt}
        </h1>
        <p className="text-left text-base font-medium leading-6">{subtxt}</p>
        <div>{children}</div>
      </div>
      {toggle ? (
        <Image
          width={464}
          height={431}
          src="/chair-v2.png"
          alt="Chairman Dn. Aderopo Olatunji OLADAPO, PhD, FCA  "
        />
      ) : (
        ""
      )}
    </div>
  );
};

Heroimg.propTypes = {
  toggle: PropTypes.bool.isRequired,
  maintxt: PropTypes.string.isRequired,
  subtxt: PropTypes.string,
  children: PropTypes.node,
  imageUrl: PropTypes.string,
};

export default Heroimg;
