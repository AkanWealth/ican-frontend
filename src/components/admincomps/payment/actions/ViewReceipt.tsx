import React, { useRef } from "react";
import type { PaymentDetailsTable } from "@/libs/types";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { printReceiptToPDF } from "./PrintReciept";
const LOGO_SRC = "/Logo_big.png";

// Helper divider
const Divider = () => <div className="my-4 border-t border-gray-200 w-full" />;

type ViewReceiptProps = {
  payment: PaymentDetailsTable | null;
  open: boolean;
  onClose: () => void;
  onPrint: (ref: React.RefObject<HTMLDivElement>) => void;
};

const ViewReceipt: React.FC<ViewReceiptProps> = ({
  payment,
  open,
  onClose,
  onPrint,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader>
          <div className="flex flex-col items-center mt-4">
            <Image
              src={LOGO_SRC}
              alt="ICAN Surulere Logo"
              width={120}
              height={40}
              className="mb-2"
              priority
            />
            <DialogTitle className="text-center text-lg font-bold mt-2">
              Payment Receipt
            </DialogTitle>
          </div>
        </DialogHeader>
        <Divider />
        <div className="p-6 bg-gray-50 rounded-md shadow-sm border">
          {payment ? (
            <div className="space-y-3">
              <div className="flex flex-col items-center mb-2">
                <span className="text-2xl font-bold text-primary">
                  ₦ {payment.amount.toFixed(2)}
                </span>
                <span className={`text-sm font-medium px-2 py-1 rounded mt-1 `}>
                  {payment.status}
                </span>
              </div>
              <Divider />
              <div className="grid grid-cols-1 gap-2 text-[15px]">
                <div>
                  <span className="font-medium">Payment name:</span>{" "}
                  {payment.billing?.name || "N/A"}
                </div>{" "}
                <div>
                  <span className="font-medium">User:</span>{" "}
                  {payment.user?.surname} {payment.user?.firstname}
                </div>
                <div>
                  <span className="font-medium">Email:</span>{" "}
                  {payment.user?.email || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Date Paid:</span>{" "}
                  {new Date(payment.datePaid).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Payment Type:</span>{" "}
                  {payment.paymentType}
                </div>
                <div>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {payment.transactionId || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {payment.paymentCategory
                    ? payment.paymentCategory
                        .replace(/[_-]/g, " ")
                        .replace(
                          /\w\S*/g,
                          (txt) =>
                            txt.charAt(0).toUpperCase() +
                            txt.substr(1).toLowerCase()
                        )
                    : "N/A"}
                </div>
                {/* Add more fields as needed */}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No payment data.
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-row gap-2 justify-end px-6 pb-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() => printReceiptToPDF(payment!)}
            className="bg-primary text-white"
          >
            Print / Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReceipt;
