"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import General from "./tabs/General";

function Settings() {
  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-col mb-6 w-full items-start justify-between">
        <h2 className="font-semibold text-2xl text-black">Settings</h2>
        <p>Manage your settings and intergrations here</p>
      </div>
      {/* Tab sections */}
      <Tabs defaultValue="general" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="general">General Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <General />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
