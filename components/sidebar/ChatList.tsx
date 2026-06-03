import { useAuth } from "@/hooks/useAuth";
import type { ChatListType } from "../../types/list.chat.type";
import { Users } from "lucide-react";

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
            {/* Avatar */}
            <div className="relative">
              {/* Thêm font-bold, text-white và đặc biệt là overflow-hidden để cắt ảnh vừa khít viền bo tròn */}
              <div
                className={`w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center font-bold text-white overflow-hidden ${
                  selectedRoom?._id === room._id
                    ? "shadow-lg shadow-emerald-500/30"
                    : ""
                }`}
              >
                {room.type === "single" ? (
                  // Nếu là chat 1-1: Tìm avatar/chữ cái đầu của đối phương
                  (() => {
                    const partner = room.members.find(
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
                  // Nếu là chat nhóm (group): Hiển thị icon nhóm mặc định của bạn
                  <Users className="w-6 h-6 text-white" />
                )}
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
