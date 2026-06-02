import axiosApi from "@/config/axios";

export const getChatListApi = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axiosApi.get("/conversation", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
