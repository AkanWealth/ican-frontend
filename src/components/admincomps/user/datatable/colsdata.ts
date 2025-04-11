export type User = {
  id: string;
  email: string;
  membershipId: string;
  surname: string;
  firstname: string;
  middlename?: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
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
  status: "Employed" | "Unemployed" | "Student" | "Retired";
  companyName?: string;
  officeAddress?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  isSuspended: boolean;
  password: string;
  isVerified: boolean;
  verificationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: string | null;
  createdAt: string;
  updatedAt: string;
  roleId: string;
  role: {
    id: string;
    name: string;
    description: string | null;
    isSuperAdmin: boolean;
    createdAt: string;
  };
  permissions: any[];
};


