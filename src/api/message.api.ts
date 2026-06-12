import axiosApi from "@/config/axios";

export const createMessage = async (data: {
  conversationId: string;
  content: string;
}) => {
  try {
    const res = await axiosApi.post("/message", data);
    return res.data;
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    throw error;
  }
};

export const getMessage = async (conversationId: string) => {
  try {
    const res = await axiosApi.get(`/message/${conversationId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi lấy tin nhắn:", error);
    throw error;
  }
};

export const reactToMessage = async (messageId: string, emoji: string) => {
  try {
    const res = await axiosApi.post(`/message/${messageId}/action`, { emoji });
    return res.data;
  } catch (error) {
    console.error("Lỗi thêm reaction:", error);
    throw error;
  }
};
