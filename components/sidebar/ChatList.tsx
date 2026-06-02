import { useAuth } from "@/hooks/useAuth";
import type { ChatListType } from "../../types/list.chat.type";

const ChatList = ({
  filteredRooms,
  selectedRoom,
  setSelectedRoom,
}: {
  filteredRooms: ChatListType[];
  selectedRoom: ChatListType | null;
  setSelectedRoom: (room: ChatListType) => void;
}) => {
  const { user } = useAuth();

  const getRoomName = (room: ChatListType) => {
    if (room.type === "group") {
      return room.name || "Nhóm chưa đặt tên";
    }

    const partner = room.members.find((member) => member._id !== user?._id);
    return partner ? partner.name : "Người dùng ẩn danh";
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {filteredRooms.map((room) => (
        <div
          key={room._id}
          onClick={() => setSelectedRoom(room)}
          className={`p-4 hover:bg-white/10 cursor-pointer transition-all duration-200 border-b border-white/10 ${
            selectedRoom?._id === room._id
              ? "bg-white/20 border-l-4 border-l-emerald-400"
              : ""
          }`}
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center ${
                  selectedRoom?._id === room._id
                    ? "shadow-lg shadow-emerald-500/30"
                    : ""
                }`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              {room.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-900"></div>
              )}
            </div>

            {/* Thông tin phòng */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold truncate">
                  {getRoomName(room)}
                </h3>
                <span className="text-xs text-white/50">{room.time}</span>
              </div>
              <p className="text-sm text-white/60 truncate">
                {room.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
