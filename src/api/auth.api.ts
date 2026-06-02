import axiosApi from "@/config/axios";
import type { LoginPayload, RegisterPayload } from "@/types/auth.type";

export const registerApi = async (data: RegisterPayload) => {
  const res = await axiosApi.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: LoginPayload) => {
  const res = await axiosApi.post("/auth/login", data);
  return res.data;
};

export const getMeApi = async () => {
  const token = localStorage.getItem("token");

  const res = await axiosApi.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
