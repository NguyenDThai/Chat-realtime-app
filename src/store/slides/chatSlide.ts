import type { ChatListType } from "@/types/list.chat.type";
import type { MessageType, ReactionType } from "@/types/message.type";
import type { UserType } from "@/types/user.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  allUser: UserType[];
  rooms: ChatListType[];
  selectedRoom: ChatListType | null;
  message: MessageType[];
  replyingMessage: MessageType | null;
}

const initialState: ChatState = {
  allUser: [],
  rooms: [],
  selectedRoom: null,
  message: [],
  replyingMessage: null,
};

export const chatSlide = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setAllUser: (state, action: PayloadAction<UserType[]>) => {
      state.allUser = action.payload;
    },

    setRooms: (state, action: PayloadAction<ChatListType[]>) => {
      state.rooms = action.payload;
    },

    // set danh sách tin nhắn vào store
    setMessage: (state, action: PayloadAction<MessageType[]>) => {
      state.message = action.payload;
    },

    updateMessageAction: (
      state,
      action: PayloadAction<{
        messageId: string;
        reactions: ReactionType[];
      }>,
    ) => {
      const { messageId, reactions } = action.payload;
      const msg = state.message.find((m) => m._id === messageId);
      if (msg) {
        msg.reactions = reactions;
      }
    },

    // Set phòng đang chọn
    setSelectedRoom: (state, action: PayloadAction<ChatListType | null>) => {
      state.selectedRoom = action.payload;
      state.replyingMessage = null;
    },

    setReplyMessage: (state, action: PayloadAction<MessageType | null>) => {
      state.replyingMessage = action.payload;
    },

    // Cập nhật khi nhận tin nhắn mới từ Socket
    receiveNewMessage: (state, action: PayloadAction<MessageType>) => {
      const newMessage = action.payload;
      const updateRoom = state.rooms.map((room) => {
        if (room._id === newMessage.conversationId) {
          return {
            ...room,
            lastMessage: newMessage,
            lastMessageAt: newMessage.createdAt,
          };
        }
        return room;
      });
      state.rooms = [...updateRoom].sort((a, b) => {
        const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
        const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
        return dateB - dateA;
      });

      if (
        state.selectedRoom &&
        state.selectedRoom._id === newMessage.conversationId
      ) {
        state.message.push(newMessage);
      }
    },

    // Xóa phòng chat khỏi danh sách chat
    handleRoomDeleted: (state, action: PayloadAction<string>) => {
      const deleteId = action.payload;
      if (state.selectedRoom?._id === deleteId) {
        state.selectedRoom = null;
      }
    },

    // Thêm tin nhắn cũ vào đầu mảng khi phân trang lên trên
    prependMessages: (state, action: PayloadAction<MessageType[]>) => {
      const existingIds = new Set(state.message.map((m) => m._id));
      const uniqueNewMessages = action.payload.filter(
        (m) => !existingIds.has(m._id),
      );
      state.message = [...uniqueNewMessages, ...state.message];
    },

    clearChatState: (state) => {
      state.rooms = [];
      state.selectedRoom = null;
      state.message = [];
    },
  },
});

export const {
  setAllUser,
  setRooms,
  setSelectedRoom,
  receiveNewMessage,
  handleRoomDeleted,
  clearChatState,
  setMessage,
  updateMessageAction,
  setReplyMessage,
  prependMessages,
} = chatSlide.actions;

export default chatSlide.reducer;
