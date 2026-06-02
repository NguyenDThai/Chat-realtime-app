import axiosApi from "@/config/axios";

export const getChatListApi = async () => {
  try {
    const res = await axiosApi.get("/conversation");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createChatListApi = async () => {
  try {
    const res = await axiosApi.post("/conversation");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
