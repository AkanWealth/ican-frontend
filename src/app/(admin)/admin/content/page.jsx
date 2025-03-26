"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import All from "./tabs/All";
import Adverts from "./tabs/Adverts";
import Blogs from "./tabs/Blogs";
import Publications from "./tabs/Publications";
import Galleries from "./tabs/Galleries";
import Technical from "./tabs/Technical";
import Student from "./tabs/Student";
import Faq from "./tabs/Faq";

import NewContent from "@/components/admincomps/content/create/NewContent";

function Content() {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Any code that accesses the document object should be placed here
  }, []);

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <h2 className="font-semibol text-2xl text-black">
          ICAN SDS Content Management System
        </h2>
        <button
          className="bg-primary text-white text-base font-semibold rounded-full w-fit px-4 py-3 h-fit"
          onClick={() => setShowModal(true)}
        >
          Add New Content
        </button>
      </div>
      {/* Tab sections */}
      <Tabs defaultValue="all" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="adverts">Adverts</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="publication">Publication</TabsTrigger>
          <TabsTrigger value="galleries">Galleries</TabsTrigger>
          <TabsTrigger value="technical">Technical Session</TabsTrigger>
          <TabsTrigger value="student">Study Pack</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <All />
        </TabsContent>
        <TabsContent value="adverts">
          <Adverts />
        </TabsContent>
        <TabsContent value="blogs">
          <Blogs />
        </TabsContent>
        <TabsContent value="publication">
          <Publications />
        </TabsContent>
        <TabsContent value="galleries">
          <Galleries />
        </TabsContent>
        <TabsContent value="technical">
          <Technical />
        </TabsContent>
        <TabsContent value="student">
          <Student />
        </TabsContent>
        <TabsContent value="faq">
          <Faq />
        </TabsContent>
      </Tabs>
      {showModal && (
        <NewContent showModal={showModal} setShowModal={setShowModal} />
      )}
    </div>
  );
}

export default Content;
