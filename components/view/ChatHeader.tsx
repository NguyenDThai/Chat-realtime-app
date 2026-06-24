import ChatAvatar from "@/components/share/ChatAvatar";
import { useAuth } from "@/hooks/useAuth";
import type { RootState } from "@/src/store";
import type { ChatListType } from "@/types/list.chat.type";
import { EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";

const ChatHeader = ({
  setShowDetailSidebar,
}: {
  setShowDetailSidebar: (show: boolean) => void;
}) => {
  const { user } = useAuth();
  const { selectedRoom, onlineUsers } = useSelector(
    (state: RootState) => state.chat,
  );

  if (!selectedRoom) return null;

  // Hiển thị trạng thái online
  const partner =
    selectedRoom.type === "single"
      ? selectedRoom.members.find((m) => m._id !== user?._id)
      : null;

  const isOnline = partner ? onlineUsers.includes(partner._id) : false;

  // ***********

  const getRoomName = (room: ChatListType) => {
    if (room.type === "group") {
      return room.name || "Nhóm chưa đặt tên";
    }

    // Hiển thị tên của người chat
    const partner = room.members.find((member) => member._id !== user?._id);
    return partner ? partner.name : "Người dùng ẩn danh";
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] p-4 border-b border-white dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Image user and group */}
          <div className="relative">
            <ChatAvatar
              room={selectedRoom}
              currentUserId={user?._id}
              className={"w-12 h-12"}
            />
          </div>

          <div>
            <h2 className="text-slate-800 dark:text-white font-bold text-lg">
              {getRoomName(selectedRoom)}
            </h2>
            <p className="text-emerald-600 dark:text-emerald-200 text-xs">
              {selectedRoom.type === "group"
                ? `${selectedRoom.members.length} thành viên`
                : isOnline
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg
              className="w-5 h-5 text-slate-600 dark:text-white/70"
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
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200">
            <svg
              className="w-5 h-5 text-slate-600 dark:text-white/70"
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
          <button
            onClick={() => setShowDetailSidebar(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200"
          >
            <EllipsisVertical className="w-5 h-5 text-slate-600 dark:text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
