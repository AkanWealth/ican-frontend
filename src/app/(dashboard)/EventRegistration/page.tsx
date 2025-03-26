"use client";

import React, { Suspense } from "react";
import EventRegistration from "../ui/EventRegisration";

const EventRegistrationPage = () => {
  return (
    <Suspense>
      <EventRegistration />;
    </Suspense>
  );
};

export default EventRegistrationPage;
