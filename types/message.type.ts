import type { UserType } from "@/types/user.type";

export interface ReactionType {
  user: UserType;
  emoji: string;
  _id?: string;
}

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
  replyTo: {
    _id: string;
    content: string;
    sender: {
      _id: string;
      name: string;
      avatar?: string;
    };
  } | null;
  isRecalled: boolean;
  deletedBy: string[];
  createdAt: string;
  updatedAt: string;
  _v?: string;
  reactions?: ReactionType[];
}

export interface PreviewFileType {
  id: string;
  file: File;
  previewUrl: string | null;
}
