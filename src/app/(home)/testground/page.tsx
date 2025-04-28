"use client";

import React, { useState } from "react";
import FlutterModal from "@/components/genui/FlutterModal";
import UploadS3 from "@/components/genui/UploadS3";

function TestingPage() {
  const [value, setValue] = useState(``);

  return (
    <div className="mt-20">
      TestingPage
      <div className="m-10 w-96">
        <FlutterModal
          amount={50000}
          email="woodsedema001@gmail.com"
          phoneNumber="08127576854"
          name="Francis Woods"
          title="Payment for services"
          paymentType="service" 
        />

        <UploadS3 />
      </div>
    </div>
  );
}

export default TestingPage;
