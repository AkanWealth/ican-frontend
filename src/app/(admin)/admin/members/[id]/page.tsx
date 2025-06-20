"use client";

import React, { useState, useEffect } from "react";

import apiClient from "@/services-admin/apiClient";
import { useToast } from "@/hooks/use-toast";

import { AuthProvider } from "@/app/(admin)/admin/LoginAuthentication/AuthContext";
import { AdminProtectedRoute } from "@/app/(admin)/admin/LoginAuthentication/AdminProtectedRoute";

import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import { BASE_API_URL } from "@/utils/setter";
import { User } from "@/libs/types";
import ExportMemberPDF from "@/components/admincomps/user/export/ExportMemberPDF";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { PaymentTable } from "@/components/admincomps/payment/datatable/PaymentTable";
import { paymentcoloumns } from "@/components/admincomps/payment/datatable/columns";
import ExportPayments from "@/components/admincomps/payment/export/ExportPayments";
import { PaymentDetailsTable } from "@/libs/types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FiBarChart2, FiCreditCard, FiUsers, FiCalendar } from "react-icons/fi";
import { SummaryCard } from "@/app/(admin)/admin/payment/tabs/Paymentsubpage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Format date to dd-mm-yyyy
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  } catch (error) {
    return "N/A";
  }
};

function PaymentHistory({ userId }: { userId: string }) {
  const router = useRouter();

  const [payments, setPayments] = useState<PaymentDetailsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState<"ALL" | "PAID" | "NOT_PAID">(
    "ALL"
  );
  const [filteredData, setFilteredData] = useState<PaymentDetailsTable[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      try {
        const config = {
          method: "get",
          url: `${BASE_API_URL}/payments`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        const result = await apiClient.request(config);
        // Only set payments where the userId matches the current userId prop
        const filteredPayments = (result || []).filter(
          (payment: PaymentDetailsTable) => payment.userId === userId
        );
        setPayments(filteredPayments);
      } catch (error) {
        toast({
          title: "Error fetching payments",
          description: "Could not load payment history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [userId, toast]);
  useEffect(() => {
    let filtered = payments;
    if (selectedTab === "PAID") {
      filtered = payments.filter(
        (d) =>
          d.status === "SUCCESS" ||
          d.status === "PARTIALLY_PAID" ||
          d.status === "FULLY_PAID"
      );
    } else if (selectedTab === "NOT_PAID") {
      filtered = payments.filter(
        (d) =>
          d.status === "PENDING" ||
          d.status === "FAILED" ||
          d.status === "REFUNDED" ||
          d.status === "NOT_PAID" ||
          d.status === "PARTIALLY_PAID"
      );
    }
    // Sort payments by createdAt descending (most recent first)
    filtered = [...filtered].sort((a, b) => {
      // Parse createdAt as Date, fallback to 0 if invalid
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    setFilteredData(filtered);
  }, [payments, selectedTab]);

  const totalAmountPaid = payments.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalUnpaid = payments.filter((d) => d.status === "PENDING").length;
  const totalAmountWaived = payments
    .filter((d) => d.status === "WAIVED")
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalOverduePayments = payments.filter(
    (d) => d.status === "PENDING"
  ).length;

  const handleSendNotification = async () => {
    if (selectedRows.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one Member",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${BASE_API_URL}/billing/send-unpaid-bill-reminders`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      data: { selectedRows },
    };

    try {
      const result = await apiClient.request(config);

      router.refresh();
      toast({
        title: "Success",
        description: "Notification sent successfully",
        variant: "default",
      });
      setSelectedRows([]);
      setIsLoading(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send Notification",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  if (loading)
    return (
      <div className="py-8 text-center">
        <svg
          className="animate-spin h-6 w-6 text-primary inline-block"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  if (!payments.length)
    return (
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
        <div className="flex flex-row justify-between">
          <div className="flex w-fit space-x-4 border-b border-gray-200 mb-4">
            {["ALL", "PAID", "NOT_PAID"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium rounded-t-lg ${
                  selectedTab === tab
                    ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                    : "text-gray-500"
                }`}
                onClick={() =>
                  setSelectedTab(tab as "ALL" | "PAID" | "NOT_PAID")
                }
              >
                {tab === "ALL" ? "All" : tab === "PAID" ? "Paid" : "Unpaid"}
              </button>
            ))}
          </div>{" "}
          <div className="flex gap-2">
            <Button
              variant="default"
              className="gap-2"
              onClick={handleSendNotification}
              disabled={isLoading}
            >
              <span>Send Notice</span>
              {isLoading && <Loader2 className="animate-spin" />}
              {selectedRows.length > 0 && (
                <Badge variant="secondary">
                  {selectedRows.length} selected
                </Badge>
              )}
            </Button>
            <ExportPayments data={filteredData} />
          </div>
        </div>

        <div>
          <PaymentTable
            columns={paymentcoloumns}
            data={filteredData}
            setter={setSelectedRows}
          />
        </div>
      </div>
    );

  return (
    <div className="rounded-3xl px-8 py-6 flex flex-col gap-4 border border-neutral-200 bg-white">
      <div className="flex gap-4 mb-6">
        <SummaryCard
          label="Total Amount Paid"
          value={
            totalAmountPaid ? `₦${totalAmountPaid.toLocaleString()}` : "₦0"
          }
          icon={<FiCreditCard size={24} />}
          iconBg="bg-green-100"
        />
        <SummaryCard
          label="Total Unpaid"
          value={totalUnpaid ? `₦${totalUnpaid.toLocaleString()}` : "₦0"}
          icon={<FiUsers size={24} />}
          iconBg="bg-blue-100"
        />
        <SummaryCard
          label="Amount Waived"
          value={
            totalAmountWaived ? `₦${totalAmountWaived.toLocaleString()}` : "₦0"
          }
          icon={<FiCalendar size={24} />}
          iconBg="bg-purple-100"
        />
        <SummaryCard
          label="Overdue Payments"
          value={
            totalOverduePayments
              ? `₦${totalOverduePayments.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
              : "₦0"
          }
          icon={<FiBarChart2 size={24} />}
          iconBg="bg-yellow-100"
        />
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex w-fit space-x-4 border-b border-gray-200 mb-4">
          {["ALL", "PAID", "NOT_PAID"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium rounded-t-lg ${
                selectedTab === tab
                  ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                  : "text-gray-500"
              }`}
              onClick={() => setSelectedTab(tab as "ALL" | "PAID" | "NOT_PAID")}
            >
              {tab === "ALL" ? "All" : tab === "PAID" ? "Paid" : "Unpaid"}
            </button>
          ))}
        </div>{" "}
        <div className="flex gap-2">
          {/* 
            Add a confirmation dialog before sending notifications.
            This prevents accidental mass notifications and improves UX.
          */}
          {/* 
            <Button
              variant="default"
              className="gap-2"
              onClick={() => setShowSendDialog(true)}
              disabled={isLoading}
            >
              <span>Send Notice</span>
              {isLoading && <Loader2 className="animate-spin" />}
              {selectedRows.length > 0 && (
                <Badge className="text-white " variant="outline">
                  {selectedRows.length} selected
                </Badge>
              )}
            </Button>
           
            <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Notice</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to send notifications to{" "}
                    {selectedRows.length} member
                    {selectedRows.length !== 1 ? "s" : ""}?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowSendDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={async () => {
                      setShowSendDialog(false);
                      await handleSendNotification();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="animate-spin mr-2" />}
                    Confirm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
           */}
          <ExportPayments data={filteredData} />
        </div>
      </div>

      <div>
        <PaymentTable
          columns={paymentcoloumns}
          data={filteredData}
          // setter={setSelectedRows}
        />
      </div>
    </div>
  );
}

function MemberDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [data, setData] = useState<User>();
  const { toast } = useToast();
  // Add edit mode state
  const [editMode, setEditMode] = useState(false);
  // Add state for form data
  const [formData, setFormData] = useState<User | undefined>(undefined);
  // Track if a save is in progress
  const [isSaving, setIsSaving] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  // Reset form data to original data
  const cancelEdit = () => {
    setFormData(data);
    setEditMode(false);
  };

  // Save changes to API
  const saveChanges = async () => {
    if (!formData) return;

    const userId = (await params).id;
    setIsSaving(true);

    try {
      // Filter out properties that should not be sent
      const filteredData = {
        email: formData.email,
        membershipId: formData.membershipId,

        surname: formData.surname,
        firstname: formData.firstname,
        middlename: formData.middlename,
        profilePicture: formData.profilePicture,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        stateOfOrigin: formData.stateOfOrigin,
        nationality: formData.nationality,

        residentialAddress: formData.residentialAddress,
        residentialCountry: formData.residentialCountry,
        residentialCity: formData.residentialCity,
        residentialState: formData.residentialState,
        residentialLGA: formData.residentialLGA,

        contactPhoneNumber: formData.contactPhoneNumber,

        institution: formData.institution,
        discipline: formData.discipline,
        qualifications: formData.qualifications,
        yearOfGraduation: formData.yearOfGraduation,
        status: formData.status,

        companyName: formData.companyName,
        officeAddress: formData.officeAddress,
        position: formData.position,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${userId}`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: filteredData,
      };

      const result = await apiClient.request(config);
      setData(result);
      setEditMode(false);

      toast({
        title: "Success!",
        description: "Member details updated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating member details:", error);
      toast({
        title: "Error updating member details!",
        description: "An error occurred while updating the member details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const userId = (await params).id;
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      };
      try {
        const result = await apiClient.request(config);
        setData(result);
        // Initialize form data with fetched data
        setFormData(result);
      } catch (error) {
        console.error("Error fetching member details:", error);
        toast({
          title: "Error fetching member details!",
          description: "Error fetching member details!",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [params, toast]);

  // Render field based on edit mode
  const renderField = (
    label: string,
    fieldName: keyof User,
    type: string = "text"
  ) => {
    return (
      <p className="text-sm text-neutral-600 flex flex-col gap-1">
        {label}
        {editMode ? (
          <input
            type={type}
            name={fieldName}
            value={
              typeof formData?.[fieldName] === "object" &&
              !Array.isArray(formData?.[fieldName])
                ? formData?.[fieldName]?.name || ""
                : formData?.[fieldName]?.toString() || ""
            }
            onChange={handleChange}
            className="text-base text-black font-medium border border-gray-300 rounded-md p-1"
          />
        ) : (
          <span className="text-base text-black font-medium">
            {fieldName === "dateOfBirth" ||
            fieldName === "startDate" ||
            fieldName === "endDate"
              ? formatDate(data?.[fieldName] as string)
              : typeof data?.[fieldName] === "object"
              ? Array.isArray(data?.[fieldName])
                ? "N/A"
                : data?.[fieldName]?.name || "N/A"
              : data?.[fieldName] || "N/A"}
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="rounded-3xl p-6">
      <div className="flex flex-row mb-6 w-full items-center justify-between">
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="flex flex-row items-center gap-2 text-primary"
          >
            <MdArrowBack className="w-6 h-6" /> Back
          </button>
          <h2 className="font-semibold text-2xl text-black">Member Details</h2>
        </div>
        {/* Add edit/save/cancel buttons */}
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <div className="flex flex-row gap-2">
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Edit Details
              </button>
              {data && <ExportMemberPDF user={data} />}
            </div>
          )}
        </div>
      </div>
      <div className="rounded-3xl px-8 py-6 flex flex-col gap-10 border border-neutral-200 bg-white">
        <div>
          <h2 className="text-xl font-semibold text-left">Bio data</h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Surname", "surname")}
            {renderField("First Name", "firstname")}
            {renderField("Middle Name", "middlename")}
            {renderField("Date of Birth", "dateOfBirth", "date")}
            {renderField("Marital Status", "maritalStatus")}
            {renderField("State of Origin", "stateOfOrigin")}
            {renderField("Nationality", "nationality")}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">
            Residential Address
          </h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Residential Address", "residentialAddress")}
            {renderField("Contact Phone Number", "contactPhoneNumber")}
            {renderField("Residential Country", "residentialCountry")}
            {renderField("Residential State", "residentialState")}
            {renderField("Residential City", "residentialCity")}
            {renderField("Residential LGA", "residentialLGA")}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">
            Educational and Professional Qualifications
          </h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Institution", "institution")}
            {renderField("Discipline", "discipline")}
            {renderField("Qualification", "qualifications")}
            {renderField("Year of Graduation", "yearOfGraduation")}
            {renderField("Status", "status")}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-left">Work Experience</h2>
          <hr />
          <div className="grid grid-cols-3 w-full gap-2 gap-y-4 mt-4">
            {renderField("Company", "companyName")}
            {renderField("Office Address", "officeAddress")}
            {renderField("Position/Role", "position")}
            {renderField("Start Date", "startDate", "date")}
            {renderField("End Date", "endDate", "date")}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberDetailsWithTabs({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => setUserId(id));
  }, [params]);

  if (!userId) return <div>Loading...</div>;

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList>
        <TabsTrigger value="details">Member Details</TabsTrigger>
        <TabsTrigger value="payments">Payment History</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <MemberDetails params={Promise.resolve({ id: userId })} />
      </TabsContent>
      <TabsContent value="payments">
        <PaymentHistory userId={userId} />
      </TabsContent>
    </Tabs>
  );
}

export default function PackedMemberDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <MemberDetailsWithTabs params={params} />
      </AdminProtectedRoute>
    </AuthProvider>
  );
}
