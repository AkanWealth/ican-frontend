import React from "react";

function Findus() {
  return (
    <div className="flex flex-col gap-8 w-full justify-between items-center p-4 md:p-20 lg:px-40 ">
      <h2 className="font-bold text-3xl sm:text-4xl text-primary  font-mono ">
        Find us on Google Map
      </h2>
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1567509302085!2d3.3259106757374997!3d6.501831723413235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8ebd36a1d01f%3A0xd57ea71a4285616c!2s30%20Oke-Onijo%20St%2C%20Lawanson%2C%20Lagos%20102215%2C%20Lagos!5e0!3m2!1sen!2sng!4v1732800769845!5m2!1sen!2sng"
          width="100%"
          height="500"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        {/* Google map image and link to office location */}
      </div>
    </div>
  );
}

export default Findus;
