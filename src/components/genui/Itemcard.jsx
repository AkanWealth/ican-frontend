import React from "react";
import PropTypes from "prop-types";
import { FaPeopleRoof } from "react-icons/fa6";

function Itemcard({
  name = "Monthly Meeting",
  bg = "bg-[#feebc4]",
  info = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  icon = <FaPeopleRoof className="w-9 h-9 fill-primary" />,
  type = "col",
}) {
  var boc;
  var floc;
  if (type === "row") {
    boc = "border";
    floc = "items-center";
  }
  return (
    <div
      className={`max-w-80 font-sans rounded-xl min-h-80 h-fit bg-white p-6 flex flex-col justify-start items-start gap-4  ${boc}`}
    >
      <div className={`flex flex-${type} ${floc}`}>
        {/* conditional styling based on usage */}
        <div className={`rounded-xl w-fit p-2 ${bg}`}>{icon}</div>
        <h6 className="font-semibold text-xl text-left text-gray-900">
          {name}
        </h6>
      </div>
      <p className="text-base font-medium text-gray-600">{info}</p>
    </div>
  );
}

Itemcard.propTypes = {
  name: PropTypes.string.isRequired, // Mandatory string for 'name'
  info: PropTypes.string.isRequired, // Mandatory string for 'info'
  icon: PropTypes.node, // Any renderable React node for 'icon'
  type: PropTypes.oneOf(["col", "row"]),
};

export default Itemcard;
