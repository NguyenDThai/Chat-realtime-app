import { useAuth } from "@/hooks/useAuth";
import type { ChatListType } from "@/types/list.chat.type";
import ChatAvatar from "@/components/share/ChatAvatar";

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
              <ChatAvatar
                room={room}
                currentUserId={user?._id}
                className={`w-12 h-12 ${selectedRoom?._id === room._id ? "shadow-lg shadow-emerald-500/30" : ""}`}
              />
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
