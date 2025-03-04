import React from "react";
import {
  MdOutlineContacts,
  MdOutlineSpeaker,
  MdOutlineLightbulb,
  MdOutlineEmojiSymbols,
  MdOutlineEscalatorWarning,
  MdOutlineLinkedCamera,
} from "react-icons/md";
import PropTypes from "prop-types";
import Itemcard from "@/components/genui/Itemcard";

function Infocard({
  subtitle = "Surulere & District Society (SDS)",
  title,
  data,
  addtxt,
}) {
  console.log(data);
  return (
    <div className=" w-full p-4 sm:py-20 sm:px-40 bg-green-100 sm:bg-blue-100 flex flex-col items-center justify-center gap-16 ">
      <div className="flex flex-col w-fit items-center gap-2">
        <h5 className="font-bold font-sans text-black text-lg sm:text-xl text-center">
          {subtitle}
        </h5>
        <h4 className="text-primary font-mono text-2xl sm:text-5xl font-bold text-center">
          {title}
        </h4>
        <p>{addtxt}</p>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-12 items-center justify-center">
        <Itemcard
          name={"Insight into contemporary and significant national issues"}
          info={
            "Gain in-depth understanding of relevant topics, equipping members to confidently contribute to industry discussions and policy debates."
          }
          icon={<MdOutlineContacts className="w-9 h-9 fill-[#916103]" />}
          type="col"
        />
        <Itemcard
          name={"Access to expert speaker"}
          info={
            "Engage with industry leaders, carefully selected to share their vast knowledge and experience, enriching members &apos; perspectives."
          }
          icon={<MdOutlineSpeaker className="w-9 h-9 fill-[#916103]" />}
          type="col"
        />
        <Itemcard
          name={"Enhanced Professional Knowledge"}
          info={
            "Sharpen your expertise as a chartered accountant. Sessions equip members to analyze and discuss critical topics with clients, colleagues, and stakeholders."
          }
          icon={<MdOutlineLightbulb className="w-9 h-9 fill-[#916103]" />}
          type="col"
        />
        <Itemcard
          name={"Interactive Learning Experience"}
          info={
            "Participate in live Q&A, discussions, and real-time clarifications for a deeper understanding compared to virtual sessions."
          }
          icon={<MdOutlineEmojiSymbols className="w-9 h-9 fill-[#916103]" />}
          type="col"
        />
        <Itemcard
          name={"Networking Opportunities"}
          info={
            "Meet speakers, exchange contacts, and connect with fellow members, fostering a vibrant professional network."
          }
          icon={
            <MdOutlineEscalatorWarning className="w-9 h-9 fill-[#916103]" />
          }
          type="col"
        />
        <Itemcard
          name={"Exclusive Experience"}
          info={
            "Create lasting memories by capturing moments, enriching your professional journey with unique experiences."
          }
          icon={<MdOutlineLinkedCamera className="w-9 h-9 fill-[#916103]" />}
          type="col"
        />
      </div>
    </div>
  );
}
Infocard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  addtxt: PropTypes.string,
  data: PropTypes.array,
};

export default Infocard;
