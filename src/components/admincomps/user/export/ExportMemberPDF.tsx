import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { User } from "@/libs/types";
import { FiDownload } from "react-icons/fi";
// Use a static path for the logo image instead of importing, as jsPDF requires a URL or base64 string.
// The public directory is served at the root, so "/Logo_big.png" is the correct path.
const logo = "/Logo_big.png";

interface ExportMemberPDFProps {
  user: User;
}

const ExportMemberPDF: React.FC<ExportMemberPDFProps> = ({ user }) => {
  const handleExport = async () => {
    const doc = new jsPDF();
    // Add logo
    // Handle both string and StaticImageData for logo import
    let logoSrc: string;
    if (typeof logo === "string") {
      logoSrc = logo;
    } else if (typeof logo === "object" && "src" in logo) {
      logoSrc = logo as string;
    } else {
      // Fallback or error handling
      throw new Error("Invalid logo format");
    }

    // Load image as base64 to ensure compatibility with jsPDF
    const toDataURL = (url: string): Promise<string> =>
      fetch(url)
        .then((response) => response.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (typeof reader.result === "string") {
                  resolve(reader.result);
                } else {
                  reject("Failed to convert image to base64");
                }
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
        );

    const imgData = await toDataURL(logoSrc);
    doc.addImage(imgData, "PNG", 10, 10, 40, 20);
    doc.setFontSize(18);
    doc.text("Member Details", 55, 22);
    let y = 35;

    // Bio Data
    doc.setFontSize(14);
    doc.text("Bio data", 10, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      theme: "plain",
      styles: { fontSize: 11 },
      head: [],
      body: [
        ["Surname", user.surname],
        ["First Name", user.firstname],
        ["Middle Name", user.middlename],
        [
          "Date of Birth",
          user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
        ],
        ["Marital Status", user.maritalStatus],
        ["State of Origin", user.stateOfOrigin],
        ["Nationality", user.nationality],
      ],
    });
    // jsPDF-AutoTable returns void unless you import and use the "autoTable" plugin's return value type.
    // To get the Y position after the last table, use (doc as any).lastAutoTable.finalY as a workaround.
    // TODO: Refactor to use the correct type for autoTable if available.
    y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 6
      : y + 6;

    // Residential Address
    doc.text("Residential Address", 10, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      theme: "plain",
      styles: { fontSize: 11 },
      head: [],
      body: [
        ["Residential Address", user.residentialAddress],
        ["Contact Phone Number", user.contactPhoneNumber],
        ["Residential Country", user.residentialCountry],
        ["Residential State", user.residentialState],
        ["Residential City", user.residentialCity],
        ["Residential LGA", user.residentialLGA],
      ],
    });
    y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 6
      : y + 6;

    // Education
    doc.text("Educational and Professional Qualifications", 10, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      theme: "plain",
      styles: { fontSize: 11 },
      head: [],
      body: [
        ["Institution", user.institution],
        ["Discipline", user.discipline],
        ["Qualification", user.qualifications],
        ["Year of Graduation", String(user.yearOfGraduation)],
        ["Status", user.status],
      ],
    });
    y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 6
      : y + 6;

    // Work Experience
    doc.text("Work Experience", 10, y);
    y += 4;
    autoTable(doc, {
      startY: y,
      theme: "plain",
      styles: { fontSize: 11 },
      head: [],
      body: [
        ["Company", user.companyName],
        ["Office Address", user.officeAddress],
        ["Position/Role", user.position],
        [
          "Start Date",
          user.startDate
            ? new Date(user.startDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
        ],
        [
          "End Date",
          user.endDate
            ? new Date(user.endDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "",
        ],
      ],
    });

    // Download
    doc.save(`member_${user.surname}_${user.firstname}.pdf`);
  };

  return (
    <Button
      onClick={handleExport}
      variant="default"
      className="gap-2 px-4 py-2 text-base rounded-md"
    >
      <span>Export PDF</span>
      <FiDownload className="w-4 h-4" />
    </Button>
  );
};

export default ExportMemberPDF;
