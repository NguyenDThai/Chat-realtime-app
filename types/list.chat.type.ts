import type { UserType } from "@/types/user.type";

export interface ChatListType {
  _id: string;
  name: string;
  avatar?: string;
  type: "single" | "group";
  members: UserType[];
  lastMessage?: {
    _id: string;
    content: string;
    serder: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  time: string;
  isOnline: boolean;
  createdBy: UserType;
}
