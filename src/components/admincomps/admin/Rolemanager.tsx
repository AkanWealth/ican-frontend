"use client";

import React, { useState, useEffect } from "react";

import axios from "axios";
import { BASE_API_URL } from "@/utils/setter";
import Toast from "@/components/genui/Toast";
import InputEle from "@/components/genui/InputEle";

import { User } from "@/libs/types";

// Props interface for role manager component
interface RolemanagerProps {
  id?: any;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
interface FormData {
  name: string;
  permissions: string[];
}
const initialFormData: FormData = {
  name: "",
  permissions: [],
};

function Rolemanager({ id, showModal, setShowModal }: RolemanagerProps) {
  return <div></div>;
}

export default Rolemanager;
