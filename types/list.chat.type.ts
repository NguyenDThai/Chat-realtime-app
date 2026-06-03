import type { UserType } from "@/types/user.type";

export interface ChatListType {
  _id: string;
  name: string;
  avatar?: string;
  type: "single" | "group";
  members: UserType[];
  lastMessage: string;
  time: string;
  isOnline: boolean;
}
