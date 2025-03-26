"use client";

import React, { useState } from "react";

import FlutterModal from "@/components/genui/FlutterModal";
function TestingPage() {
  const [value, setValue] = useState(``);

  return (
    <div className="mt-20">
      TestingPage
      <div className="m-10 w-96">
        <FlutterModal
          amount={50000}
          email="woodsedema001@gmail.com"
          phone_number="08127576854"
          name="Francis Woods"
        />
      </div>
    </div>
  );
}

export default TestingPage;
