import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useSocket } from "@/hooks/useSocket";
import type { RootState } from "@/src/store";
import {
  clearChatState,
  handleRoomDeleted,
  receiveNewMessage,
} from "@/src/store/slides/chatSlide";
import type { MessageType } from "@/types/message.type";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// File này để bắt sự kiện socket

export const useChat = () => {
  const dispatch = useDispatch();
  const { fetchAllUser, fetchChatList } = useData();
  const { rooms } = useSelector((state: RootState) => state.chat);
  const socket = useSocket();
  const { user } = useAuth();
  const roomRef = useRef(rooms);

  useEffect(() => {
    roomRef.current = rooms;
  }, [rooms]);

  useEffect(() => {
    if (user) {
      fetchChatList();
      fetchAllUser();
    } else {
      dispatch(clearChatState());
    }
  }, [user, dispatch, fetchAllUser, fetchChatList]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (newMessage: MessageType) => {
      const hasRoom = roomRef.current.some(
        (room) => room._id === newMessage.conversationId,
      );

      if (!hasRoom) {
        fetchChatList();
      } else {
        dispatch(receiveNewMessage(newMessage));
      }
    };

    const handleConversationDelete = (deleteId: string) => {
      dispatch(handleRoomDeleted(deleteId));
      fetchChatList();
    };

    socket.on("new_message", handleReceiveMessage);
    socket.on("coversation_delete", handleConversationDelete);

    return () => {
      socket.off("new_message", handleReceiveMessage);
      socket.off("coversation_delete", handleConversationDelete);
    };
  }, [socket, dispatch, fetchChatList]);
};
