import React from "react";
import Heroimg from "@/components/homecomps/Heroimg";
import Dontoday from "@/components/homecomps/Dontoday";

function Donate() {
  return (
    <div className="flex flex-col items-center ">
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Support Our Mission"
        imageUrl="/donatehero.png"
      />

      <Dontoday />
    </div>
  );
}

export default Donate;
