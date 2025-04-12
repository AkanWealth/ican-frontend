import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

function Cta({ toggle }) {
  // Call to action components that changes tag line based on usage and toggle switch
  return (
    <div className="flex flex-col gap-8 w-full items-center py-20 bg-blue-100 bg-[url('/ctatexture.svg')] bg-no-repeat bg-right">
      <h5 className="text-black font-bold font text-xl items-center text-center">
        {toggle ? (
          <>
            Check your membership status anytime with your <br /> membership
            number or credentials
          </>
        ) : (
          <>
            Would you like to maximize your potentials by
            <br /> joining our district society?
          </>
        )}
      </h5>
      <Link href="/sign-up">
        <button className="rounded-full bg-primary py-3 px-8 w-fit text-base text-white">
          Become a Member
        </button>
      </Link>
    </div>
  );
}
Cta.propTypes = {
  toggle: PropTypes.bool,
};

export default Cta;
