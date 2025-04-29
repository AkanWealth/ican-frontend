import React from "react";
import {
  MdOutlineUnpublished,
  MdSubtitles,
  MdOutlineDateRange,
} from "react-icons/md";
import { HiOutlineTag } from "react-icons/hi";
import { BASE_API_URL } from "@/utils/setter";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import apiClient from "@/services-admin/apiClient";

interface DisableAdminProps {
  id: string;
  fullName: string;
  role: string;
  onClose: () => void;
}

function DisableAdmin({ id, fullName, role, onClose }: DisableAdminProps) {
  const { toast } = useToast();
  const router = useRouter();
  const handleConfirm = () => {
    console.log({ id, fullName, role });
    async function fetchData() {
      const data = JSON.stringify({
        userId: id,
        suspend: true,
      });
      const config = {
        method: "patch",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/users/${id}/suspend`,
        headers: {
          Accept: "application/json",
          ContentType: "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        data: data,
      };
      try {
        const results = await apiClient.request(config);
        console.log(results);

        toast({
          title: "User Disabled",
          description: results.message,
          variant: "default",
        });
        onClose(); // Close the modal after successful update
        router.refresh();
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.response?.message || "An error occurred",
          variant: "destructive",
        });
        onClose(); // Close the modal after successful update
        router.refresh();
      }
    }
    fetchData();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-4 rounded-xl gap-4 bg-white">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-yellow-200">
            <MdOutlineUnpublished className="w-6 h-6 fill-yellow-400" />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-xl text-black">Disable User</h5>
              <p className="text-sm text-neutral-600">
                Are you sure you want to disable this user?
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Name:
                </p>
                <p className="text-black font-medium text-base ">{fullName}</p>
              </div>

              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base   items-centerflex-row gap-2">
                  <HiOutlineTag className="w-4 h-4" /> Role:
                </p>
                <p className="text-black font-medium text-base ">{role}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleConfirm}
            className="flex items-center w-2/5 text-center justify-center bg-primary font-semibold text-base text-white rounded-full py-3 px-4 h-10"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex items-center w-2/5 text-center justify-center bg-transparent font-semibold text-base text-neutral-700 border border-primary rounded-full py-3 px-4 h-10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DisableAdmin;
