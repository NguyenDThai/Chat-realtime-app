import axiosApi from "@/config/axios";

export interface CreateChatPayload {
  type: "single" | "group";
  name?: string;
  members: string[];
  avatar?: string;
}

export const getChatListApi = async () => {
  try {
    const res = await axiosApi.get("/conversation");

    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createChatListApi = async (data: CreateChatPayload) => {
  try {
    const res = await axiosApi.post("/conversation", data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
