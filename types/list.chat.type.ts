import type { MessageType } from "@/types/message.type";
import type { UserType } from "@/types/user.type";

export interface ChatListType {
  _id: string;
  name: string;
  avatar?: string;
  type: "single" | "group";
  members: UserType[];
  lastMessage?: MessageType;
  lastMessageAt?: string;
  time: string;
  isOnline: boolean;
  createdBy: UserType;
  unreadCount?: number;
}
