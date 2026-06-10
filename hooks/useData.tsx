import { useSocket } from "@/hooks/useSocket";
import { getChatListApi } from "@/src/api/chat.list.api";
import { getMessage } from "@/src/api/message.api";
import { getAllUserApi } from "@/src/api/user.api";
import type { RootState } from "@/src/store";
import { setAllUser, setMessage, setRooms } from "@/src/store/slides/chatSlide";
import type { ChatListType } from "@/types/list.chat.type";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// File này sử dụng để call api và lấy dữ liệu đưa và store global

export const useData = () => {
  const { selectedRoom } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const socket = useSocket();

  const fetchChatList = useCallback(async () => {
    try {
      const res = await getChatListApi();
      dispatch(setRooms(res));

      if (res && res.length > 0) {
        res.forEach((room: ChatListType) => {
          socket.emit("join_room", room._id);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, socket]);

  const fetchAllUser = useCallback(async () => {
    try {
      const res = await getAllUserApi();
      dispatch(setAllUser(res));
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
    }
  }, [dispatch]);

  const fetchMessage = useCallback(async () => {
    try {
      const res = await getMessage(selectedRoom._id);
      dispatch(setMessage(res));
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, selectedRoom]);

  return {
    fetchChatList,
    fetchAllUser,
    fetchMessage,
  };
};
