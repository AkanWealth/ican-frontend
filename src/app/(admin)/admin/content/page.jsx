"use client";

import React, { useState } from "react";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [data, setData] = useState([]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
      <Tabs defaultValue="blogs" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="adverts">Adverts</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="galleries">Galleries</ TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="technical">Technical Session</TabsTrigger>
          <TabsTrigger value="student">Study Pack</TabsTrigger>
        </TabsList>
       
        <TabsContent value="adverts">
          <Adverts />
        </TabsContent>
        <TabsContent value="blogs">
          <Blogs />
        </TabsContent>
        <TabsContent value="resources">
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

export default function PackedContentPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <Content />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
