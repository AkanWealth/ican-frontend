export interface Billing {
  id: string;
  name: string;
  type: "Subscription" | "One-time";
  amount: number;
  createdBy: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "DRAFT";
  createdAt: string;
  createdByUser: {
    id: string;
    email: string;
    membershipId: string;
    surname: string;
    firstname: string;
    middlename: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    maritalStatus: string | null;
    stateOfOrigin: string | null;
    nationality: string | null;
    residentialAddress: string | null;
    residentialCountry: string | null;
    residentialCity: string | null;
    residentialState: string | null;
    residentialLGA: string | null;
    contactPhoneNumber: string | null;
    institution: string | null;
    discipline: string | null;
    qualifications: string | null;
    yearOfGraduation: string | null;
    status: string | null;
    companyName: string | null;
    officeAddress: string | null;
    position: string | null;
    startDate: string | null;
    endDate: string | null;
    isSuspended: boolean;
    password: string;
    isVerified: boolean;
    verificationToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: string | null;
    createdAt: string;
    updatedAt: string;
    roleId: string;
  };
  payments: any[];
  affectedUsers: {
    id: string;
    billingId: string;
    userId: string;
  }[];
}


