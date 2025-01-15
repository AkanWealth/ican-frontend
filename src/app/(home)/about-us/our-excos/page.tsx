import React from "react";
import Heroimg from "@/components/Heroimg";
import Cta from "@/components/Cta";
import Exco from "@/components/genui/Exco";

function Ourteam() {
  return (
    <>
      <Heroimg
        subtxt={""}
        toggle={false}
        maintxt="Our Excos"
        imageUrl="/ourteamhero.png"
      >
        <></>
      </Heroimg>
      <div className="flex flex-col items-start text-left gap-12 p-4 lg:px-40 md:p-20 justify-start ">
        <div className=" flex flex-col gap-4 items-start justify-between ">
          <h2 className="text-primary font-semibold font-mono text-5xl  ">
            Our Executive Team
          </h2>
          <p className="text-base text-sans font-normal text-black">
            Meet the leaders behind our district. Dedicated professionals
            working to serve our community.
          </p>
        </div>
        <div className="w-full flex items-center flex-col sm:flex-row gap-10 flex-wrap">
          <Exco
            name="Dr Aderopo Oladapo, FCA"
            role="Chairman"
            imgurl="/excos/Exco.png"
          />
          <Exco
            name="Tosin D. Akinwummi, FCA"
            role="Vice Chairman"
            imgurl="/excos/Exco-1.png"
          />
          <Exco
            name="Dr Bode Oguntoke, FCA"
            role="General Secretary "
            imgurl="/excos/Exco-2.png"
          />
          <Exco
            name="Dcns. Abosede Ogunjobi, FCA"
            role="Trasurer "
            imgurl="/excos/Exco-3.png"
          />
          <Exco
            name="Dr Anthonia Alebiosu, FCA"
            role="Technical Secretary "
            imgurl="/excos/Exco-4.png"
          />
          <Exco
            name="Durowoju A. Olatunde, FCA"
            role="Financial Secretary "
            imgurl="/excos/Exco-5.png"
          />
          <Exco
            name="Idiat Omotola Steven, ACA"
            role="Membership Secretary "
            imgurl="/excos/Exco-6.png"
          />
          <Exco
            name="Temitope Oyeyipo, ACA"
            role="Social and publicity Secretary "
            imgurl="/excos/Exco-7.png"
          />
          <Exco
            name="Ajayi-Owoeye Auooluwa, ACA"
            role="General Secretary "
            imgurl="/excos/Exco-8.png"
          />
          <Exco
            name="Aliu Kamiyo, ACA"
            role="Chairman, Community Relations Committee "
            imgurl="/excos/Exco-9.png"
          />
          <Exco
            name="Goodnedd Opaleye, ACA"
            role="Chairman, Publications Commitee"
            imgurl="/excos/Exco-10.png"
          />
          <Exco
            name="Sunkanmi Sesan Ogungbaiye, ACA"
            role="General Secretary "
            imgurl="/excos/Exco-11.png"
          />
          <Exco
            name="Temilola Bolaji Olatoye, ACA"
            role="SWAN Coordinator "
            imgurl="/excos/Exco-12.png"
          />
          <Exco
            name="Ejekukor Gloria Omonigho, ACA"
            role="Chairman, Events and Conference Committee"
            imgurl="/excos/Exco-13.png"
          />
        </div>
      </div>

      <Cta toggle />
    </>
  );
}

export default Ourteam;
