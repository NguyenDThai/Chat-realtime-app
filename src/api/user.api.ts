import axiosApi from "@/config/axios";

export const getAllUserApi = async () => {
  try {
    const res = await axiosApi.get("/user");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
