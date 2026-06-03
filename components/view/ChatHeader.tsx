import { useAuth } from "@/hooks/useAuth";
import type { ChatListType } from "@/types/list.chat.type";
import { Users } from "lucide-react";
import React from "react";

const ChatHeader = ({ selectedRoom }: { selectedRoom: ChatListType }) => {
  const { user } = useAuth();

  const getRoomName = (room: ChatListType) => {
    if (room.type === "group") {
      return room.name || "Nhóm chưa đặt tên";
    }

    const partner = room.members.find((member) => member._id !== user?._id);
    return partner ? partner.name : "Người dùng ẩn danh";
  };

  return (
    <div className="bg-emerald-900/40 p-4 border-b border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Image user and group */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center font-bold text-white overflow-hidden">
              {selectedRoom.type === "single" ? (
                // Nếu là chat 1-1, tìm avatar đối phương
                (() => {
                  const partner = selectedRoom.members.find(
                    (m) => m._id !== user?._id,
                  );
                  return partner?.avatar &&
                    (partner.avatar.startsWith("http") ||
                      partner.avatar.includes("/")) ? (
                    <img
                      src={partner.avatar}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    partner?.name.charAt(0).toUpperCase() || "?"
                  );
                })()
              ) : (
                // Nếu là nhóm, hiển thị icon nhóm mặc định
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <div>
            <h2 className="text-white font-bold text-lg">
              {getRoomName(selectedRoom)}
            </h2>
            <p className="text-emerald-200 text-xs">
              {selectedRoom.type === "group"
                ? `${selectedRoom.members.length} thành viên`
                : "online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg
              className="w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg
              className="w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg
              className="w-5 h-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
