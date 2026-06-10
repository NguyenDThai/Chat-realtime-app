import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useSocket } from "@/hooks/useSocket";
import {
  clearChatState,
  handleRoomDeleted,
  receiveNewMessage,
} from "@/src/store/slides/chatSlide";
import type { MessageType } from "@/types/message.type";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// File này để bắt sự kiện socket

export const useChat = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { user } = useAuth();

  const { fetchAllUser, fetchChatList } = useData();

  useEffect(() => {
    if (user) {
      fetchChatList();
      fetchAllUser();
    } else {
      dispatch(clearChatState());
    }
  }, [user, dispatch, fetchAllUser, fetchChatList]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage: MessageType) => {
      dispatch(receiveNewMessage(newMessage));
    };

    socket.on("new_message", handleReceiveMessage);

    return () => {
      socket.off("new_message", handleReceiveMessage);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const handleConversationDelete = (deleteId: string) => {
      dispatch(handleRoomDeleted(deleteId));
      fetchChatList();
    };

    socket.on("coversation_delete", handleConversationDelete);

    return () => {
      socket.off("coversation_delete", handleConversationDelete);
    };
  }, [socket, dispatch, fetchChatList]);
};
