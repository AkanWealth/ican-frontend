import React, { useState, useEffect } from "react";
import apiClient from "@/services-admin/apiClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BASE_API_URL } from "@/utils/setter";
import { Billing } from "@/libs/types";

interface CreateWaiverProps {
  isOpen: boolean;
  onClose: () => void;
  billingId: string;
  createdById: string;
  mode: "billing" | "table";
}

function CreateWaiver({
  isOpen,
  onClose,
  billingId,
  createdById,
  mode,
}: CreateWaiverProps) {
  const [expiryDate, setExpiryDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdWaiver, setCreatedWaiver] = useState<any>(null);
  const { toast } = useToast();

  const [billingData, setbillingData] = useState<Billing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedBilling, setSelectedBilling] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [usageType, setUsageType] = useState<"unlimited" | "limited">(
    "unlimited"
  );
  const [maxUsages, setMaxUsages] = useState<number | "">("");

  /**
   * Validates that the expiry date is in the future.
   * @param date - The expiry date string (YYYY-MM-DD).
   * @returns An error message if invalid, otherwise null.
   */
  const validateExpiryDate = (date: string): string | null => {
    const selectedDate = new Date(date);
    const now = new Date();

    if (selectedDate <= now) {
      return "Expiry date must be in the future";
    }
    return null;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch billing data
        const response = await apiClient.get(`${BASE_API_URL}/billing`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        // Filter results by searchTerm (case-insensitive)
        const filtered = response.filter((item: any) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filtered);
        setbillingData(response.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    }
    fetchData();
  }, [mode, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateExpiryDate(expiryDate);

    if (mode === "table" && !selectedBilling) {
      setError("Please select a billing record.");
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    if (usageType === "limited" && (!maxUsages || Number(maxUsages) < 1)) {
      setError("Please enter a valid number for max usages.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: any = {
        billingId: mode === "billing" ? billingId : selectedBilling.id,
        createdById:
          mode === "billing" ? createdById : selectedBilling.createdById,
        expiresAt: expiryDate,
      };
      if (usageType === "limited") {
        payload.maxUsages = Number(maxUsages);
      }
      const response = await apiClient.post("/payments/waiver", payload);
      setCreatedWaiver(response);
      setShowSuccessPopup(true);
      // setTimeout(() => {
      //   setShowSuccessPopup(false);
      //   onClose();
      //   window.location.reload();
      // }, 3000);
    } catch (err) {
      setError("Failed to create waiver. Please try again.");
      console.error("Waiver creation error:", err);
      toast({
        title: "Error Creating Waiver",
        description: "There was an error while trying to create the waiver.",
        variant: "destructive",
      });
      // window.location.reload();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Payment Waiver Code</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "table" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Billing</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for bill name"
                    value={
                      selectedBilling ? `${selectedBilling.name}` : searchTerm
                    }
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedBilling(null);
                      setError(null);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    onBlur={() =>
                      setTimeout(() => setIsDropdownOpen(false), 150)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  {isDropdownOpen && searchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <div
                            key={result.id}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${
                              selectedBilling?.id === result.id
                                ? "bg-gray-200"
                                : ""
                            }`}
                            onMouseDown={() => {
                              setSelectedBilling(result);
                              setSearchTerm(`${result.name} (${result.id})`);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {result.name} 
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">
                          No billing records found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedBilling && (
                  <div className="text-xs text-green-700">
                    Selected: {selectedBilling.name} 
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Waiver Usage Limit</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="usageType"
                    value="unlimited"
                    checked={usageType === "unlimited"}
                    onChange={() => {
                      setUsageType("unlimited");
                      setMaxUsages("");
                      setError(null);
                    }}
                  />
                  Unlimited
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="usageType"
                    value="limited"
                    checked={usageType === "limited"}
                    onChange={() => {
                      setUsageType("limited");
                      setError(null);
                    }}
                  />
                  Limited
                </label>
              </div>
              {usageType === "limited" && (
                <div className="mt-2">
                  <input
                    type="number"
                    min={1}
                    value={maxUsages}
                    onChange={(e) => {
                      const val = e.target.value;
                      setMaxUsages(val === "" ? "" : Math.max(1, Number(val)));
                      setError(null);
                    }}
                    placeholder="Enter max usages"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required={usageType === "limited"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Set the maximum number of times this waiver can be used
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="expiryDate"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Expiry Date
              </label>
              <input
                type="datetime-local"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => {
                  setExpiryDate(e.target.value);
                  setError(null);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-sm text-muted-foreground">
                Select when this waiver should expire
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Waiver"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Waiver Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-md">
              <pre className="text-base font-semibold overflow-auto">
                <p>Waiver Code: {createdWaiver?.code}</p>
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              This popup will close automatically in 3 seconds...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateWaiver;
