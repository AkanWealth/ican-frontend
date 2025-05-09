"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import Billingsubpage from "./tabs/Billingsubpage";
import Paymentsubpage from "./tabs/Paymentsubpage";

function BillingPage() {
  return (
    <div className="rounded-3xl p-6">
      <Tabs defaultValue="billing">
        <TabsList>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="billing">
          <Billingsubpage />
        </TabsContent>
        <TabsContent value="payments">
          <Paymentsubpage />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function PackedBillingPage() {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <BillingPage />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
