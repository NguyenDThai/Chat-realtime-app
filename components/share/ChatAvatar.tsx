import { type FC } from "react";
import type { ChatListType } from "@/types/list.chat.type";
import { Users } from "lucide-react";

interface ChatAvatarProps {
  room: ChatListType;
  currentUserId?: string;
  className?: string; // Cho phép truyền class CSS tùy chỉnh (ví dụ: kích thước w-12 h-12)
}

const ChatAvatar: FC<ChatAvatarProps> = ({
  room,
  currentUserId,
  className = "w-12 h-12",
}) => {
  const isSingle = room.type === "single";

  // 1. Nếu là Chat 1-1
  if (isSingle) {
    const partner = room.members.find((m) => m._id !== currentUserId);
    const hasAvatar =
      partner?.avatar &&
      (partner.avatar.startsWith("http") || partner.avatar.includes("/"));

    return (
      <div
        className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center font-bold text-white overflow-hidden ${className}`}
      >
        {hasAvatar ? (
          <img
            src={partner.avatar}
            alt={partner.name}
            className="w-full h-full object-cover"
          />
        ) : (
          partner?.name.charAt(0).toUpperCase() || "?"
        )}
      </div>
    );
  }

  // 2. Nếu là Chat Nhóm (Group)
  const hasGroupAvatar =
    room.avatar &&
    (room.avatar.startsWith("http") || room.avatar.includes("/"));

  return (
    <div
      className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center font-bold text-white overflow-hidden ${className}`}
    >
      {hasGroupAvatar ? (
        <img
          src={room.avatar}
          alt={room.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <Users className="w-5 h-5 text-white" />
      )}
    </div>
  );
};

export default ChatAvatar;
