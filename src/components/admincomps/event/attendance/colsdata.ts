export interface UserAttendance {
  id: string;
  name: string;
  email: string;
  memberid: string | number | "non-member";
  status: "present" | "absent" | "registred" | "pending";
}

