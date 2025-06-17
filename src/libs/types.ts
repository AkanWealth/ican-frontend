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
  amount: number;
  createdAt: string;
  autoApply: boolean;
  createdById: string;
  nextDueDate: string | null;
  description: string | null;
  frequency: string;
  nextBillingAt: string | null;
  createdBy: User;
  Payment: {
    id: string;
    userId: string;
    billingId: string;
    paymentType: string;
    amount: number;
    datePaid: string;
    status: string;
    transactionId: string | null;
    subscriptionId: string | null;
    anonymous: boolean;
    createdAt: string;
    donationOption: string | null;
    paymentCategory: string;
    eventId: string | null;
  }[];
  affectedUsers: {
    id: string;
    billingId: string;
    userId: string;
    amountPaid: number;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    user: User;
  }[];
};

type BillingPayment = {
  id: string;
  userId: string;
  billingId: string;
  paymentType: string;
  amount: number;
  datePaid: string;
  status: string;
  transactionId: string | null;
  subscriptionId: string | null;
  anonymous: boolean;
  createdAt: string;
  donationOption: string | null;
  paymentCategory: string;
  eventId: string | null;
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

type PaymentDetailsTable = {
  id: string;
  userId: string;
  billingId: string | null;
  invoiceId: string | null;
  paymentType: string;
  amount: number;
  datePaid: string;
  status: PaymentStatus | string;
  transactionId: string | null;
  subscriptionId: string | null;
  anonymous: boolean;
  createdAt: string;
  donationOption: string | null;
  paymentCategory: PaymentCategory | string;
  eventId: string | null;
  user: User;
  billing: Billing | null;
};

type PaymentStatus =
  | "SUCCESS"
  | "WAIVED"
  | "FAILED"
  | "PENDING"
  | "REFUNDED"
  | "NOT_PAID"
  | "PARTIALLY_PAID"
  | "FULLY_PAID";
type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED";
type BillingStatus = "PENDING" | "COMPLETED" | "CANCELED";
type AttendanceStatus = "REGISTERED" | "ABSENT" | "PRESENT";
type MembershipStatus = "MEMBER" | "NON_MEMBER";
type EventStatus = "DRAFT" | "CANCELLED" | "COMPLETED" | "UPCOMING";
type PaymentCategory = "DONATION" | "ONE_TIME" | "RECURRING";
type BillingFrequency = "ONE_TIME" | "MONTHLY" | "YEARLY";
type NotificationChannel = "EMAIL" | "PUSH" | "SMS";
type NotificationTopic = "GENERAL" | "PAYMENT" | "EVENT";
type ResourceType = "PODCAST" | "DOCUMENT" | "VIDEO";
type ResourceAccess = "PUBLIC" | "RESTRICTED" | "MEMBERS_ONLY";

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
    frequency: string;
  };
};

type BillingUsersDetails = {
  id: string;
  name: string;
  type: string;
  amount: number;
  createdBy: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
  createdByUser: {
    id: string;
    email: string;
    membershipId: string;
    surname: string;
    firstname: string;
  };
  payments: {
    id: string;
    userId: string;
    billingId: string;
    paymentType: string;
    amount: number;
    datePaid: string;
    status: string;
    transactionId: string;
  }[];
  affectedUsers: {
    id: string;
    billingId: string;
    userId: string;
    amountPaid: number;
    paymentStatus: "NOT_PAID" | "PARTIALLY_PAID" | "PAID";
  }[];
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

type BillingPaymentTable = {
  id: string;
  userId: string;
  billingId: string;
  paymentType: string;
  amount: number;
  datePaid: string;
  status: string;
  transactionId: string | null;
  subscriptionId: string | null;
  anonymous: boolean;
  createdAt: string;
  donationOption: string | null;
  paymentCategory: string;
  eventId: string | null;
};

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
  total?: number;
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
  eventId: string;
  status: string;
  proofOfPayment: string;
  createdAt: string;
  userId: string;
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
  status: "active" | "inactive" | string;
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

type Advert = {
  id: string;
  name: string;
  advertiser: string;
  content: string;
  startDate: string;
  endDate: string;
  coverImg: string;
  status: "published" | "draft" | "hidden" | "expired" | "pending";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user: {
    firstname: string;
    surname: string;
    email: string;
  };
};

type BlogPost = {
  id: string;
  title: string;
  authorName: string;
  contentType: string;
  coverImage: string;
  contentBody: string;
  createdAt: string;
  updatedAt: string;
};

type StudyPack = {
  id: string;
  name: string;
  document: string;
  createdBy: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected" | string;
  user: {
    id: string;
    email: string;
  };
};

type Billing = {
  id: string;
  name: string;
  amount: number;
  createdAt: string;
  autoApply: boolean;
  createdById: string;
  nextDueDate: string | null;
  description: string | null;
  frequency: "ONE_TIME" | "MONTHLY" | "YEARLY" | string;
  nextBillingAt: string | null;
  createdBy: User;
  Payment: {
    id: string;
    userId: string;
    billingId: string;
    paymentType: string;
    amount: number;
    datePaid: string;
    status: "SUCCESS" | "PENDING" | string;
    transactionId: string;
    subscriptionId: string | null;
    anonymous: boolean;
    createdAt: string;
    donationOption: string | null;
    paymentCategory: string;
    eventId: string | null;
  }[];
  affectedUsers: {
    id: string;
    billingId: string;
    userId: string;
    amountPaid: number;
    paymentStatus: "NOT_PAID" | "FULLY_PAID" | string;
    createdAt: string;
    updatedAt: string;
    user: User;
  }[];
};
type UpdatedBillingStats = {
  billingId: string;
  name: string;
  totalBillingAmount: number;
  paymentsMade: number;
  totalAmountPaid: number;
  totalUsersAffected: number;
  totalUsersPaid: number;
  totalUsersNotPaid: number;
  stackedChartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
};

type WaiverCode = {
  id: string;
  code: string;
  billingId: string;
  createdById: string;
  usedById: string | null;
  expiresAt: string;
  createdAt: string;
  maxUsages: number | string | null;
  currentUsages: number;
  usedBy:
    | {
        id: string;
        email: string;
      }[]
    | null;
  billing: Billing | null;
  createdBy: User;
};

type UserOwing = {
  id: string;
  billingId: string;
  userId: string;
  amountPaid: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  user: User;
  billing: Billing;
};

export type {
  Advert,
  Billing,
  BlogPost,
  StudyPack,
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
  PaymentDetailsTable,
  BillingUsersDetails,
  EventDetails,
  DashEventReg,
  DashUserLogin,
  Resource,
  DashEventAttendanceTrend,
  DashEventPaymentTrend,
  TechnicalPost,
  Publication,
  UpdatedBillingStats,
  BillingPaymentTable,
  WaiverCode,
  UserOwing,
};
