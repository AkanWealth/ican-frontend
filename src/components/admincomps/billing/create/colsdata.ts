export interface BillUser {
  id: string;
  name: string;
  memberid: string | number;
  status: "completed" | "cancelled" | "draft" | "pending";
}

