import React from "react";
import { MdSubtitles, MdDeleteOutline } from "react-icons/md";
import { BASE_API_URL } from "@/utils/setter";

import apiClient from "@/services-admin/apiClient";

import { useToast } from "@/hooks/use-toast";
interface DeleteRoleProps {
  id: string;
  role: string;
  onClose: () => void;
}

function DeleteRole({ id, role, onClose }: DeleteRoleProps) {
  const { toast } = useToast();
  const handleDelete = () => {
    console.log({ id, role });
    async function fetchData() {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${BASE_API_URL}/roles/${id}`,
        headers: {
          Accept: "application/json",
          ContentType: "application/json",
        },
      };
      try {
        const results = await apiClient.request(config);
        console.log(results.data);
        toast({
          title: "Role Deleted",
          description: "Role deleted successfully",
          variant: "default",
        });
        window.location.reload();
        onClose();
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "An error occurred while deleting",
          variant: "destructive",
        });
        onClose();
        window.location.reload();
      }
    }
    fetchData();
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col p-8 rounded-xl gap-4 bg-white w-[800px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        <div className="flex flex-row justify-start gap-4">
          <div className="rounded-full  h-fit w-fit p-4 bg-red-200">
            <MdDeleteOutline className="w-6 h-6 fill-red-600" />
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-xl text-black">Delete Role</h5>
              <p className="text-sm text-neutral-600">
                Are you sure you want to delete this role?
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-row items-center gap-4">
                <p className="flex text-neutral-700 font-medium text-base flex-row  items-center gap-2">
                  <MdSubtitles className="w-4 h-4" /> Name:
                </p>
                <p className="text-black font-medium text-base ">{role?.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toLowerCase())}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center w-fit text-center justify-center bg-red-600 font-semibold whitespace-nowrap text-base text-white rounded-full py-3 px-4 h-10"
          >
            Permanently Delete role
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

export default DeleteRole;
