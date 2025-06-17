import React from "react";
import { Button } from "@/components/ui/button";
import { PaymentDetailsTable, User, Billing } from "@/libs/types";
import { FiDownload } from "react-icons/fi";

// Utility: Flatten User fields with prefix
function flattenUser(user: User | undefined | null, prefix = "user_") {
  if (!user) return {};
  const {
    role,
    permissions,
    password,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpires,
    ...rest
  } = user;
  const flat: Record<string, any> = {};
  Object.entries(rest).forEach(([k, v]) => (flat[`${prefix}${k}`] = v));
  if (role) {
    Object.entries(role).forEach(([k, v]) => (flat[`${prefix}role_${k}`] = v));
  }
  return flat;
}

// Utility: Flatten Billing fields with prefix
function flattenBilling(
  billing: Billing | undefined | null,
  prefix = "billing_"
) {
  if (!billing) return {};
  const { createdBy, Payment, affectedUsers, ...rest } = billing;
  const flat: Record<string, any> = {};
  Object.entries(rest).forEach(([k, v]) => (flat[`${prefix}${k}`] = v));
  return flat;
}

// Utility: Flatten PaymentDetailsTable row
function flattenPayment(payment: PaymentDetailsTable) {
  const { user, billing, ...rest } = payment;
  return {
    ...rest,
    ...flattenUser(user),
    ...flattenBilling(billing),
  };
}

// Utility: Convert array of objects to CSV string
function toCSV(rows: any[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const csvRows = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];
  return csvRows.join("\r\n");
}

type ExportPaymentsProps = {
  data: PaymentDetailsTable[];
};

const ExportPayments: React.FC<ExportPaymentsProps> = ({ data }) => {
  const handleExport = () => {
    const flatRows = data.map(flattenPayment);
    const csv = toCSV(flatRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleExport}
      variant="default"
      className="gap-2"
    >
      <span>Export Payments</span>
      <FiDownload className="w-4 h-4" />
    </Button>
  );
};

export default ExportPayments;
