import { IconType } from "react-icons";

type UserDetails = {
  id: string;
  email: string;
  role: string;
  store: string;
};

type CreateUserDetails = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  account: string;
  store: string;
};

type OnboardingDetails = {
  account: {
    account_type: "individual" | "business";
    name: string;
    business_type: string;
    country: string;
    registered_name?: string;
    registration_no?: string;
    tin?: string;
    registered_address?: string;
    director_name?: string;
    collects_collateral?: boolean;
    is_verified?: boolean;
    logo?: File | null;
  };
  settings: {
    primary_color: string;
  };
  user: {
    id?: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: string;
    phone_number: string;
  };
};

type CreateTransactionsProps = {
  id?: string;
  mode: "create" | "edit";
  in_type: "buy" | "sell" | "valuation" | "loan";
  name?: string;
  itemValue?: number | string;
  start_date?: string;
  end_date?: string;
  approved_by?: string;
  valued_by?: string;

  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

type CreateCustomerProps = {
  mode: "create" | "edit";

  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  nin?: string;
  bvn?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  customerData?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    nin: string;
    bvn: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };

  showModal: boolean;
  setShowModal: (show: boolean) => void;
};

type CustomerFormData = {
  account?: string;
  store?: string;
  role?: string;
  customer?: string;

  item_name?: string;
  item_description?: string;
  item_value?: number | string;
  sale_price?: number | string;
  valuation_price?: number | string;
  amount?: number;
  interest_rate?: number;
  duration_weeks?: number;
  due_date?: string;
  approvedBy?: string;
};

type CustomerTableData = {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  created_at: string;
  updated_at: string;
};

type StatCardProps = {
  name: string;
  metric: number | string;
  Icon: IconType;
};

type TransactionsFormData = {
  account?: string;
  store?: string;
  role?: string;
  customer?: string;

  item_name?: string;
  item_description?: string;
  item_value?: number | string;
  sale_price?: number | string;
  valuation_price?: number | string;
  amount?: number;
  interest_rate?: number;
  duration_weeks?: number;
  due_date?: string;
  approvedBy?: string;
};
type TransactionTableData = {
  transaction_id: string;
  account: string;
  store: string;
  customer: string;
  total_item_value: string;
  amount: string;
  interest_rate: number;
  loan_total: string;
  duration_weeks: number;
  due_date: string;
  status:
    | string
    | "opened"
    | "processing"
    | "success"
    | "failed"
    | "approved"
    | "rejected";
  created_by: string;
  created_at: string;
  updated_at: string;
};

type LoansTransactionTableData = {
  transaction_id: string;
  account: string;
  store: string;
  customer: string;
  total_item_value: string;
  amount: string;
  interest_rate: number;
  loan_total: string;
  duration_weeks: number;
  due_date: string;
  status:
    | string
    | "opened"
    | "processing"
    | "success"
    | "failed"
    | "approved"
    | "rejected";
  created_by: string;
  valued_by: string;
  approved_by: string;
  productid: string;
  extended: boolean;
  extended_date: string;
  last_due_date: string;
  created_at: string;
  updated_at: string;
};

export type {
  UserDetails,
  TransactionTableData,
  CustomerTableData,
  CreateUserDetails,
  OnboardingDetails,
  CreateTransactionsProps,
  CreateCustomerProps,
  TransactionsFormData,
  StatCardProps,
  CustomerFormData,
};
