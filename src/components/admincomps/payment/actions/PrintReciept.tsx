import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { PaymentDetailsTable } from "@/libs/types";

// Path to your logo in public folder
const LOGO_SRC = "/Logo_big.png";

/**
 * Generates a styled PDF receipt for the given payment and triggers download.
 * @param payment PaymentDetailsTable - the payment data to render
 * @param options Optional: { logoUrl?: string, extraFields?: Record<string, string>, items?: Array<{ description: string, amount: number }>, notes?: string }
 */
export async function printReceiptToPDF(
  payment: PaymentDetailsTable,
  options?: {
    logoUrl?: string;
    extraFields?: Record<string, string>;
    items?: Array<{ description: string; amount: number }>;
    notes?: string;
  }
) {
  // Create a temporary DOM node for rendering
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  // Format category
  const formatCategory = (cat?: string) =>
    cat
      ? cat
          .replace(/[_-]/g, " ")
          .replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
      : "N/A";

  // Format date
  const now = new Date();
  const createdAt = now.toLocaleString();

  // Helper: Render extra fields
  const renderExtraFields = (fields?: Record<string, string>) => {
    if (!fields) return "";
    return Object.entries(fields)
      .map(
        ([key, value]) =>
          `<div><b>${key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}:</b> ${
            value || "N/A"
          }</div>`
      )
      .join("");
  };

  // Helper: Render itemized breakdown
  const renderItems = (
    items?: Array<{ description: string; amount: number }>
  ) => {
    if (!items || items.length === 0) return "";
    return `
      <div style="margin: 18px 0 0 0;">
        <div style="font-weight: bold; color: #1A379A; margin-bottom: 6px;">Breakdown</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.98rem;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 4px 0; border-bottom: 1px solid #e5e7eb;">Description</th>
              <th style="text-align: right; padding: 4px 0; border-bottom: 1px solid #e5e7eb;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) =>
                  `<tr>
                    <td style="padding: 2px 0;">${item.description}</td>
                    <td style="text-align: right; padding: 2px 0;">₦ ${item.amount.toFixed(
                      2
                    )}</td>
                  </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  };

  // Helper: Render notes
  const renderNotes = (notes?: string) => {
    if (!notes) return "";
    return `<div style="margin-top: 16px; font-size: 0.97rem; color: #444; background: #f8fafc; border-radius: 6px; padding: 10px 12px;">${notes}</div>`;
  };

  // Render the receipt HTML
  container.innerHTML = `
    <div style="width:430px; font-family: 'Inter', Arial, sans-serif; background: #fff; border-radius: 14px; box-shadow: 0 2px 16px rgba(0,0,0,0.10); border: 1px solid #e5e7eb; padding: 36px 28px; color: #222;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src='${
            options?.logoUrl || LOGO_SRC
          }' alt='Logo' style='height:48px;'/>
          <div style="font-size: 1.1rem; font-weight: 600; color: #1A379A;">ICAN Surulere & District Society</div>
        </div>
        <div style="font-size: 0.95rem; color: #888; text-align: right;">${createdAt}</div>
      </div>
      <div style="text-align:center; margin-bottom: 20px;">
        <span style="font-size: 2.2rem; font-weight: bold; color: #1A379A; letter-spacing: 1px;">₦ ${payment.amount.toFixed(
          2
        )}</span><br/>
        <span style="font-size: 1rem; font-weight: 500; color: #fff; background: #1A379A; border-radius: 6px; padding: 2px 14px; display: inline-block; margin-top: 7px;">${
          payment.status
        }</span>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 18px 0;" />
      <div style="display: flex; flex-wrap: wrap; gap: 0 18px; font-size: 1rem; line-height: 1.7; margin-bottom: 10px;">
        <div style="flex: 1 1 180px; min-width: 160px;">
          <div><b>Receipt ID:</b> ${payment.id}</div>
          <div><b>User:</b> ${payment.user?.surname || ""} ${
    payment.user?.firstname || ""
  }</div>
          <div><b>Email:</b> ${payment.user?.email || "N/A"}</div>
          <div><b>Phone:</b> ${
            payment.user?.contactPhoneNumber ||
            options?.extraFields?.Phone ||
            "N/A"
          }</div>
          <div><b>Address:</b> ${options?.extraFields?.Address || "N/A"}</div>
        </div>
        <div style="flex: 1 1 180px; min-width: 160px;">
          <div><b>Date Paid:</b> ${
            payment.datePaid
              ? new Date(payment.datePaid).toLocaleString()
              : "N/A"
          }</div>
          <div><b>Payment Type:</b> ${payment.paymentType}</div>
          <div><b>Transaction ID:</b> ${payment.transactionId || "N/A"}</div>
          <div><b>Category:</b> ${formatCategory(payment.paymentCategory)}</div>
          <div><b>Reference:</b> ${
            options?.extraFields?.Reference || "N/A"
          }</div>
        </div>
      </div>
      ${renderExtraFields(options?.extraFields)}
      ${renderItems(options?.items)}
      ${renderNotes(options?.notes)}
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 18px 0;" />
      <div style="font-size: 0.95rem; color: #888; text-align: center; margin-top: 18px;">
        <div>Generated: ${createdAt}</div>
        <div style="font-size:0.9rem; color:#aaa;">ICAN Surulere & District Society</div>
      </div>
    </div>
  `;

  // Use html2canvas to render the node to a canvas
  const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });

  // Create PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: [450, 650],
  });
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 10, 10, 430, 630);
  pdf.save(`receipt_${payment.id}.pdf`);

  // Clean up
  document.body.removeChild(container);
}
