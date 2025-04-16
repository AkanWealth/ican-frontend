"use client";
import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Check } from "lucide-react";
import { Leckerli_One, League_Spartan } from "next/font/google";
import Image from "next/image";

const leckerliOne = Leckerli_One({ subsets: ["latin"], weight: "400" });
interface CertificateGeneratorProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}
const leagueSpartan = League_Spartan({ subsets: ["latin"], weight: "200" });

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  eventId,
  eventTitle,
  onSuccess,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userData, setUserData] = useState<{
    firstname: string;
    surname: string;
    middleName?: string;
  }>({
    firstname: "Member",
    surname: "",
    middleName: "",
  });
  const [certificateId] = useState(
    Math.floor(100000 + Math.random() * 900000).toString()
  );
  const [eventDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  );
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        setUserData({
          firstname: parsedUser?.firstname || "Member",
          surname: parsedUser?.surname || "",
          middleName: parsedUser?.middleName || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const generateAndDownloadCertificate = async () => {
    if (!certificateRef.current) return;

    setIsGenerating(true);

    try {
      // First show the certificate so it can render properly
      setShowPreview(true);

      // Wait for the certificate to be visible in the DOM
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: true,
      });

      // Convert the canvas to a data URL and download it
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `ICAN_Certificate_${userData.surname.replace(
        /\s+/g,
        "_"
      )}.png`;
      link.click();

      // Show success notification
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setShowPreview(false); // Hide preview after download
      }, 3000);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert(
        "There was an error generating your certificate. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Certificate Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-10 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-bold">Certificate Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Certificate Content */}
            <div
              ref={certificateRef}
              className="relative w-[595px] h-[842px] bg-white p-8 rounded-lg shadow-lg overflow-hidden"
              style={{
                fontFamily: "Arial, sans-serif",
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/certificate-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Decorative Border */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  bottom: "20px",
                  border: "1px solid #ffffff",
                  borderRadius: "10px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              ></div>

              {/* Certificate Content */}
              <div className="relative z-10 flex flex-col items-center justify-between h-full py-6 space-y-4">
                <div className="text-center items-center">
                  <div className="flex justify-center mb-8">
                    <Image
                      src="/Icanlogo.png"
                      alt="ICAN Logo"
                      className="w-auto item-center"
                      width={200}
                      height={100}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center mb-12">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">
                      CERTIFICATE OF ATTENDANCE
                    </h1>
                    <Image
                      src="/ceriticateDesign.png"
                      alt="ICAN certificate Logo"
                      className=" item-center"
                      width={323}
                      height={200}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center mt-8 mb-4">
                    <p className="text-2xl font-bold mb-4">
                      This is to recognize
                    </p>
                    <p
                      className={`text-3xl font-bold my-4 text-blue-700 ${leckerliOne.className}`}
                    >
                      {`${userData.surname} ${userData.firstname} ${
                        userData.middleName || ""
                      }`}
                    </p>
                    <div className="w-64 border-t-2 border-blue-700 mb-8"></div>
                    <p
                      className={`text-3xl font-medium  my-4 text-gray-700 ${leagueSpartan.className}`}
                    >
                      for attending the {eventTitle}
                    </p>
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-center mt-2 mb-4">
                    <div className="text-center mx-4 my-12">
                      <div className="w-32 border-t-2 border-black"></div>
                      <p className="mt-2 mb-2 font-bold  text-base text-primary">
                        Adebayo Jegede
                      </p>
                      <p className="text-xs text-blue-900">President</p>
                    </div>
                    <div className="w-full text-center mx-8">
                      <Image
                        src="/award-badge.png"
                        alt="Signature"
                        className="mb-2"
                        width={153} // Set appropriate width
                        height={120}
                      />
                    </div>
                    <div className="text-center mx-4 my-12">
                      <div className="w-32 border-t-2 border-black"></div>
                      <p className="mt-2 mb-2 font-bold text-primary text-base">
                        Nngozi Essien
                      </p>
                      <p className="text-xs text-blue-900">General Secretary</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm mt-8 text-gray-700 px-4">
                    <div>Date Issued: {eventDate}</div>
                    <div>Certificate ID: {certificateId}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 mr-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={generateAndDownloadCertificate}
                disabled={isGenerating}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Download Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md flex items-center shadow-lg z-50">
          <Check className="w-5 h-5 mr-2" />
          <span>Certificate downloaded successfully!</span>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={() => setShowPreview(true)}
        disabled={isGenerating}
        className="px-6 py-2 rounded-full transition-colors border border-primary text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Generating..." : "Download Certificate"}
      </button>
    </>
  );
};

export default CertificateGenerator;
