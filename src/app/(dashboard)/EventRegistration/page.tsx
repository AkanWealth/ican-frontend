"use client";

import React, { Suspense } from "react";
import EventRegistration from "../ui/EventRegisration";

const EventRegistrationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventRegistration />
    </Suspense>
  );
};

export default EventRegistrationPage;
