import React from "react";
import PropTypes from "prop-types";
import { FaCheck } from "react-icons/fa";

function Reason({
  name = "Monthly Meeting",
  info = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  icon = <FaCheck className="w-9 h-9 fill-primary" />,
  type = "col",
}) {
  var boc;
  var floc;
  if (type === "row") {
    boc = "border";
    floc = "items-center";
  }
  return (
    <div className="flex p-6 rounded-2xl flex-col  ">
      <div className="flex flex-row items-center gap-2 justify-start ">
        <div className=" p-1  bg-white rounded flex items-center justify-center">
          <FaCheck className="w-6 h-6 fill-primary" />
        </div>
        <p className=" text-black font-semibold text-xl ">{name}</p>
      </div>
      <p className=" text-gray-600 font-normal text-base ">{info}</p>
    </div>
  );
}

Reason.propTypes = {
  name: PropTypes.string.isRequired, // Mandatory string for 'name'
  info: PropTypes.string.isRequired, // Mandatory string for 'info'
  icon: PropTypes.node, // Any renderable React node for 'icon'
  type: PropTypes.oneOf(["col", "row"]),
};

export default Reason;
