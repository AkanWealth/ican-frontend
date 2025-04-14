import { IconType } from "react-icons";

type BillingDetails = {
  id: string;
  name: string;
  type: string;
  amount: number;
  createdBy: string;
  status: string;
  createdAt: string;
  createdByUser: User;
  payments: any[];
  affectedUsers: {
    id: string;
    billingId: string;
    userId: string;
  }[];
};

type User = {
  id: string;
  email: string;
  membershipId: string;
  surname: string;
  firstname: string;
  middlename: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  stateOfOrigin: string;
  nationality: string;
  residentialAddress: string;
  residentialCountry: string;
  residentialCity: string;
  residentialState: string;
  residentialLGA: string;
  contactPhoneNumber: string;
  institution: string;
  discipline: string;
  qualifications: string;
  yearOfGraduation: number;
  status: string;
  companyName: string;
  officeAddress: string;
  position: string;
  startDate: string;
  endDate: string;
  password: string;
  isVerified: boolean;
  verificationToken: string;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  isSuspended: boolean;
  profilePicture: string;
  role: {
    id: string;
    name: string;
    description: string | null;
    isSuperAdmin: boolean;
    createdAt: string;
  };
  permissions: any[];
};

type StatCardProps = {
  name: string;
  metric: number | string;
  Icon: IconType;
};

type CreateContentProps = {
  id?: string;
  mode: "create" | "edit";
};

export type { User, StatCardProps, CreateContentProps, BillingDetails };
