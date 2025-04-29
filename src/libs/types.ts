import { IconType } from "react-icons";

type FaqData = {
  id: string;
  name: string;
  answer: string;
  createdAt: string;
};

type BillingDetails = {
  id: string;
  name: string;
  type: string;
  amount: number;
  createdBy: string;
  status: string;
  createdAt: string;
  createdByUser: User;
  payments: {
    id: string;
    userId: string;
    billingId: string;
    paymentType: string;
    amount: number;
    datePaid: string;
    status: string;
    transactionId: string | null;
    subscriptionId: string | null;
  }[];
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
type RolesData = {
  id: string;
  name: string;
  description: string | null;
  isSuperAdmin: boolean;
  createdAt: string;
  permissions: {
    id: string;
    roleId: string;
    permissionId: string;
  }[];
};
type PaymentDets = {
  id: string;
  member_name: string;
  member_id: string | number;
  payment_type: string;
  billing_name: string;
  amount: string;
  date: string;
  created_by: string;
  reciept_url: string;
  status: "completed" | "overdue" | "pending";
  user: {
    firstname: string;
    surname: string;
  };
  billing: {
    name: string;
    type: string;
    createdAt: string;
  };
};

type OverdueBills = {
  user: {
    firstname: string;
    surname: string;
  };
  billing: {
    name: string;
    type: string;
    createdAt: string;
    amount: number;
  };
};

/**
 * Represents a payment transaction with details about the payment and associated user
 */
type PaymentDetails = {
  /** Unique identifier for the payment */
  id: string;

  /** Amount of the payment */
  amount: number;

  /** Type of payment made (e.g., Bank Transfer) */
  paymentType: string;

  /** Current status of the payment */
  status: "PENDING" | "COMPLETED" | "FAILED";

  /** Date when the payment was made */
  datePaid: string;

  /** Unique transaction identifier */
  transactionId: string;

  /** ID of the associated billing record */
  billingId: string | null;

  /** ID of the associated subscription */
  subscriptionId: string | null;

  /** ID of the user who made the payment */
  userId: string;

  /** User details associated with the payment */
  user: User;
};

type EventDetails = {
  id: string;
  name: string;
  venue: string;
  description: string;
  date: string;
  time: string;
  fee: number;
  mcpd_credit: number;
  flyer: string | null;
  meeting_link: string | null;
  status: "DRAFT" | "ONGOING" | "CANCELLED" | "COMPLETED" | "UPCOMING";
  createdAt: string;
};

export interface PaymentBasic {
  id: string;
  userId: string;
  billingId: string;
  paymentType: string;
  amount: number;
  datePaid: string;
  status: string;
  transactionId: string | null;
  subscriptionId: string | null;
}

type DashEventReg = {
  id: string;
  name: string;
  _count: {
    registrations: number;
  };
  registrations: {
    status: "REGISTERED" | "CANCELLED" | "PENDING";
  }[];
};

interface DashEventAttendanceTrend {
  month: string;
  count: number;
}
interface DashEventPaymentTrend {
  month: string;
  totalPaid: number;
}

type DashUserLogin = {
  weeklyLogins: {
    day: string;
    count: number;
  }[];
  monthlyLogins: {
    week: string;
    count: number;
  }[];
  yearlyLogins: {
    month: string;
    count: number;
  }[];
};

type RegisteredUsers = {
  id: string;
  fullName: string;
  email: string;
  membership: string;
  status: string;
  proofOfPayment: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  type: string;
  access: "PUBLIC" | "MEMBERS";
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  recommended: boolean;
};

type GalleryItem = {
  id: string;
  name: string;
  images: string[];
  videos: string[];
  createdBy: string;
  createdAt: string;
  status: "active" | "inactive";
  user: {
    firstname: string;
    surname: string;
    email: string;
  };
};

type TechnicalPost = {
  id: string;
  name: string;
  document: string;
  coverImg: string;
  createdAt: string;
  status: "DRAFT" | "PUBLISHED";
  createdBy: string;
  user: {
    firstname: string;
    email: string;
  };
};

type Publication = {
  id: string;
  title: string;
  description: string;
  type: string;
  access: "PUBLIC" | "MEMBERS" | string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  recommended: boolean;
};

export type {
  GalleryItem,
  RegisteredUsers,
  User,
  RolesData,
  StatCardProps,
  CreateContentProps,
  FaqData,
  BillingDetails,
  OverdueBills,
  PaymentDets,
  PaymentDetails,
  EventDetails,
  DashEventReg,
  DashUserLogin,
  Resource,
  DashEventAttendanceTrend,
  DashEventPaymentTrend,
  TechnicalPost,
  Publication,
};
