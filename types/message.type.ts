import type { UserType } from "@/types/user.type";

export interface ReadByType {
  user: string;
  _id: string;
  readAt: string;
}

export interface MessageType {
  _id: string;
  conversationId: string;
  sender: UserType;
  content: string;
  readBy: ReadByType[];
  replyTo: string | null;
  isRecalled: boolean;
  deletedBy: string[];
  createdAt: string;
  updatedAt: string;
  _v?: string;
}
