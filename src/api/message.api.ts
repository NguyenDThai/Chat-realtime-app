import axiosApi from "@/config/axios";

export const createMessage = async (data: {
  conversationId: string;
  content: string;
  replyTo?: string;
}) => {
  try {
    const res = await axiosApi.post("/message", data);
    return res.data;
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    throw error;
  }
};

export const getMessage = async (
  conversationId: string,
  cursor?: string,
  limit: number = 20,
) => {
  try {
    const res = await axiosApi.get(`/message/${conversationId}`, {
      params: {
        cursor,
        limit,
      },
    });
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

export const markMessageAsReadApi = async (conversationId: string) => {
  try {
    const res = await axiosApi.put(`/message/read/${conversationId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi đánh dấu đã đọc", error);
    throw error;
  }
};

export const recallMessageApi = async (messageId: string) => {
  try {
    const res = await axiosApi.post(`/message/${messageId}/recall`);
    return res.data;
  } catch (error) {
    console.error("Lỗi thu hồi tin nhắn: ", error);
    throw error;
  }
};
