import React from "react";
import Heroimg from "@/components/Heroimg";
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
          <h2 className="text-primary font-semibold font-mono text-3xl sm:text-5xl  ">
            Our Executive Team
          </h2>
          <p className="text-base text-sans font-normal text-black">
            Meet the leaders behind our district. Dedicated professionals
            working to serve our community.
          </p>
        </div>
        <div className="w-full flex items-center flex-col sm:flex-row gap-10 flex-wrap">
          <Exco
            name="Dcn. Aderopo Olatunji OLADAPO, PhD, FCA"
            role="Chairman"
            imgurl="/excos/Exco.png"
            linkedin="https://www.linkedin.com/in/aderopo-oladapo-6053a623?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          />
          <Exco
            name="Tosin Daniel AKINWUNMI, FCA"
            role="Vice Chairman"
            imgurl="/excos/Exco-1.png"
            linkedin="https://www.linkedin.com/in/tos%C4%B1n-ak%C4%B1nwunm%C4%B1-fca-fcti-msc-bsc-hnd-3904a453?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app%20"
          />
          <Exco
            name="Bode OGUNTOKE, PhD, FCA"
            role="General Secretary "
            imgurl="/excos/Exco-2.png"
            linkedin="https://www.linkedin.com/in/dr-bode-oguntoke-3a87731a"
          />
          <Exco
            name="Dcns. Abosede Abidemi OGUNJOBI, FCA"
            role="Treasurer "
            imgurl="/excos/Exco-3.png"
            linkedin="https://www.linkedin.com/in/abosede-ogunjobi-fca-acti-19292631?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          />
          <Exco
            name="Olatunde Abdulrauf DUROWOJU, FCA"
            role="Financial Secretary "
            imgurl="/excos/Exco-5.png"
            linkedin="https://www.linkedin.com/in/olatunde-durowoju-mba-msc-fcti-fca-239bb173"
          />
          <Exco
            name="Anthonia Opeyemi ALEBIOSU, PhD, FCA"
            role="Technical Secretary "
            imgurl="/excos/Exco-4.png"
            linkedin="https://www.linkedin.com/in/anthonia-alebiosu-phd-fca-fcti-29826121"
          />
          <Exco
            name="Temilola Bolaji OLATOYE, ACA"
            role="SWAN Coordinator "
            imgurl="/excos/Exco-12.png"
            linkedin=""
          />
          <Exco
            name="Ayooluwa Eunice AJAYI-OWOEYE, PhD, ACA"
            role="Assistant General Secretary "
            imgurl="/excos/Exco-8.png"
            linkedin="https://www.linkedin.com/in/ayooluwa-ajayi-owoeye"
          />
          <Exco
            name="Temitope Mopelola OYEYIPO, ACA"
            role="Social and Publicity Secretary "
            imgurl="/excos/Exco-7.png"
            linkedin="https://www.linkedin.com/in/temitope-oyeyipo-555b6a197?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          />
          <Exco
            name="Aliu Abiodun KAMIYO, FCA"
            role="Chairman, Community Relations Committee "
            imgurl="/excos/Exco-9.png"
            linkedin="https://ng.linkedin.com/in/aliu-kamiyo"
          />
          <Exco
            name="Idiat Omotola STEVEN, ACA"
            role="Chairman, Membership Committee"
            imgurl="/excos/Exco-6.png"
            linkedin="http://linkedin.com/in/idiat-omotola-steven-58006ab5"
          />
          <Exco
            name="Gloria Omonigho EJEKUKOR, ACA"
            role="Chairman, Events and Conference Committee"
            imgurl="/excos/Exco-13.png"
            linkedin=""
          />
          <Exco
            name="Sunkanmi Sesan OGUNGBAIYE, ACA"
            role="Chairman, Students Affairs Committee"
            imgurl="/excos/Exco-11.png"
            linkedin="https://www.linkedin.com/in/ogungbaiyesunkanmi08035019078/"
          />
          <Exco
            name="Goodness OPALEYE, ACA"
            role="Chairman, Publications Commitee"
            imgurl="/excos/Exco-10.png"
            linkedin="https://www.linkedin.com/in/goodness-opaleye-aat-bsc-aca-bb7638164?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          />
        </div>
      </div>
    </>
  );
}

export default Ourteam;
