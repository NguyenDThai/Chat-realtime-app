import { useAuth } from "@/hooks/useAuth";
import { useData } from "@/hooks/useData";
import { useSocket } from "@/hooks/useSocket";
import type { RootState } from "@/src/store";
import {
  clearChatState,
  handleRoomDeleted,
  receiveNewMessage,
  updateMessageAction,
  setOnlineUsers,
} from "@/src/store/slides/chatSlide";
import type { ChatListType } from "@/types/list.chat.type";
import type { MessageType, ReactionType } from "@/types/message.type";
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

    const handleNewConversation = (newConversation: ChatListType) => {
      console.warn(newConversation);

      fetchChatList();
    };

    const handleConversationDelete = (deleteId: string) => {
      dispatch(handleRoomDeleted(deleteId));
      fetchChatList();
    };

    // handle action message
    const handleActionMessage = (data: {
      messageId: string;
      reactions: ReactionType[];
    }) => {
      dispatch(updateMessageAction(data));
    };

    // handler lắng nghe sự kiện online
    const handleUserOnline = (onlineUserId: string[]) => {
      dispatch(setOnlineUsers(onlineUserId));
    };

    socket.on("new_message", handleReceiveMessage);
    socket.on("new_conversation", handleNewConversation);
    socket.on("coversation_delete", handleConversationDelete);
    socket.on("action_message", handleActionMessage);
    socket.on("user_online", handleUserOnline);

    return () => {
      socket.off("new_message", handleReceiveMessage);
      socket.off("new_conversation", handleNewConversation);
      socket.off("coversation_delete", handleConversationDelete);
      socket.off("action_message", handleActionMessage);
      socket.off("user_online", handleUserOnline);
    };
  }, [socket, dispatch, fetchChatList]);
};
