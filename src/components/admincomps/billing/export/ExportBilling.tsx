// src/components/admincomps/billing/export/ExportBilling.tsx

import React from "react";
import * as XLSX from "xlsx";
import { BillingDetails, User } from "@/libs/types";

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
  if (user.role) {
    Object.entries(user.role).forEach(
      ([k, v]) => (flat[`${prefix}role_${k}`] = v)
    );
  }
  return flat;
}

const ExportBilling: React.FC<{ data: BillingDetails[] }> = ({ data }) => {
  const handleExport = () => {
    // Sheet 1: Payments
    const payments: any[] = [];
    data.forEach((billing) => {
      billing.Payment.forEach((payment) => {
        payments.push({
          billing_id: billing.id,
          billing_name: billing.name,
          ...payment,
        });
      });
    });

    // Sheet 2: Affected Users
    const affectedUsers: any[] = [];
    data.forEach((billing) => {
      billing.affectedUsers.forEach((au) => {
        affectedUsers.push({
          billing_id: billing.id,
          billing_name: billing.name,
          ...au,
          ...flattenUser(au.user),
        });
      });
    });

    // Create workbook and sheets
    const wb = XLSX.utils.book_new();
    const wsPayments = XLSX.utils.json_to_sheet(payments);
    const wsAffectedUsers = XLSX.utils.json_to_sheet(affectedUsers);

    XLSX.utils.book_append_sheet(wb, wsPayments, "Payments");
    XLSX.utils.book_append_sheet(wb, wsAffectedUsers, "Affected Users");

    // Export with bill name in filename if available
    const billName = data && data.length > 0 && data[0].name
      ? data[0].name.replace(/[^a-z0-9]/gi, "_").toLowerCase()
      : "billing";
    XLSX.writeFile(
      wb,
      `${billName}_export_${new Date().toISOString()}.xlsx`
    );
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Export Billing as XLSX
    </button>
  );
};

export default ExportBilling;
