import React, { useState } from "react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const MIN_DATE = "2025-06-01";

  // Helper: filter payments by date range
  function filterByDateRange(payments: PaymentDetailsTable[]) {
    if (!startDate && !endDate) return payments;
    return payments.filter((p) => {
      const date = p.createdAt ? new Date(p.createdAt) : null;
      if (!date) return false;
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    });
  }

  const handleExport = () => {
    const filtered = filterByDateRange(data);
    const flatRows = filtered.map(flattenPayment);
    const csv = toCSV(flatRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_export_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        variant="default"
        className="gap-2"
      >
        <span>Export Payments</span>
        <FiDownload className="w-4 h-4" />
      </Button>
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <h2 style={{ margin: 0 }}>Select Date Range</h2>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                min={MIN_DATE}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ marginLeft: 8 }}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                min={MIN_DATE}
                max={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginLeft: 8 }}
              />
            </label>
            <div
              style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}
            >
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                // Ensure disabled is always boolean, not "" (empty string)
                disabled={
                  !Boolean(endDate) ||
                  (Boolean(startDate) && Boolean(endDate) && startDate > endDate)
                }
              >
                Export
              </Button>
            </div>
            <small style={{ color: "#888" }}>
              Max exportable date is June 1, 2025. You can change both dates.
            </small>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportPayments;
