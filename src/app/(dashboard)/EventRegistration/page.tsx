"use client";

import React, { Suspense } from "react";
import EventRegistration from "../ui/EventRegisration";
import { Suspense } from "react";

const EventRegistrationPage = () => {
  return (
    <Suspense>
      <EventRegistration />;
    </Suspense>
  );
};

export default EventRegistrationPage;
