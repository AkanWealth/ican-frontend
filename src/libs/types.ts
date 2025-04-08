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

type StatCardProps = {
  name: string;
  metric: number | string;
  Icon: IconType;
};

type CreateContentProps = {
  id?: string;
  mode: "create" | "edit";
};

export type {
  UserDetails,
  CreateUserDetails,
  StatCardProps,
  CreateContentProps,
};
