import ChatAvatar from "@/components/share/ChatAvatar";
import { useData } from "@/hooks/useData";
import { createChatListApi } from "@/src/api/chat.list.api";
import type { RootState } from "@/src/store";
import { setSelectedRoom } from "@/src/store/slides/chatSlide";
import type { UserType } from "@/types/user.type";
import { MessageSquare, Phone, Video, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface UserProfileModalProps {
  user: UserType;
  onClose: () => void;
  setActiveTab?: (value: string) => void;
}

const UserProfileModal = ({
  user,
  onClose,
  setActiveTab,
}: UserProfileModalProps) => {
  const { onlineUsers, rooms } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const { fetchChatList } = useData();

  const isOnline = onlineUsers.includes(user._id);

  const handleCreateChat = async () => {
    // Nếu đã có phòng chat đó rồi
    const existingRoom = rooms.find(
      (room) =>
        room.type === "single" &&
        room.members.some((member) => member._id === user._id),
    );

    if (existingRoom) {
      dispatch(setSelectedRoom(existingRoom));
      if (setActiveTab) {
        setActiveTab("chat");
      }
      onClose();
      return;
    }

    // Khởi tạo phòng chat nếu chưa có phòng chat
    try {
      const newRoom = await createChatListApi({
        type: "single",
        members: [user._id],
      });

      if (newRoom) {
        dispatch(setSelectedRoom(newRoom));
        if (setActiveTab) {
          setActiveTab("chat");
        }
        fetchChatList();
        onClose();
      }
    } catch (error) {
      console.error("Lỗi khi mở cuộc trò chuyện:", error);
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 select-none"
    >
      <div className="relative w-[385px] bg-white dark:bg-[#2D2D2D] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-black dark:text-white">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar lớn kèm trạng thái online */}
        <div className="relative mt-4">
          <ChatAvatar user={user} className="w-20 h-20" />
          {isOnline && (
            <div className="absolute bottom-1 right-0 w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          )}
        </div>
        {/* Tên trạng thái hoạt động */}
        <h3 className="mt-3 text-lg font-bold dark:text-white">{user.name}</h3>
        <p className="text-xs text-gray-400">
          {isOnline ? "Đang hoạt động" : "Không hoạt động"}
        </p>
        {/* Các nút hành động */}
        <div className="w-full grid grid-cols-3 gap-2.5 mt-5">
          <button
            onClick={handleCreateChat}
            className="flex flex-col items-center justify-center p-3 bg-[#F9FAFB] dark:bg-[#4F4F4F] hover:bg-white/10 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer border-none text-[16px] font-medium text-black dark:text-white gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-black dark:text-white" />
            Nhắn tin
          </button>
          <button
            onClick={() => alert("Chức năng chưa được triển khai")}
            className="flex flex-col items-center justify-center p-3 bg-[#F9FAFB] dark:bg-[#4F4F4F] hover:bg-white/10 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer border-none text-[16px] font-medium text-black dark:text-white gap-1.5"
          >
            <Phone className="w-4 h-4 text-black dark:text-white" />
            Gọi
          </button>
          <button
            onClick={() => alert("Chức năng chưa được triển khai")}
            className="flex flex-col items-center justify-center p-3 bg-[#F9FAFB] dark:bg-[#4F4F4F] hover:bg-white/10 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer border-none text-[16px] font-medium text-black dark:text-white gap-1.5"
          >
            <Video className="w-4 h-4 text-black dark:text-white" />
            Video
          </button>
        </div>

        {/* Information detail */}
        <div className="w-full mt-6 space-y-4 text-sm">
          <div className="flex items-cente border-gray-100 pb-2">
            <span className="text-black/80 dark:text-gray-400 w-[80px]">
              Phòng ban
            </span>
            <span className="text-black dark:text-white font-medium">
              Đang cập nhật
            </span>
          </div>
          <div className="flex items-center border-gray-100 pb-2">
            <span className="text-black/80 dark:text-gray-400 w-[80px]">
              Vai trò
            </span>
            <span className="text-black dark:text-white font-medium">
              Thành viên
            </span>
          </div>
          <div className="flex items-center border-gray-100 pb-2">
            <span className="text-black/80 dark:text-gray-400 w-[80px]">
              Ngày sinh
            </span>
            <span className="text-black dark:text-white font-medium">
              Đang cập nhật
            </span>
          </div>
          <div className="flex items-center border-gray-100 pb-2">
            <span className="text-black/80 dark:text-gray-400 w-[80px]">
              Email
            </span>
            <span className="text-black dark:text-white font-medium">
              {user.email}
            </span>
          </div>
          <div className="flex items-center border-gray-100 pb-2">
            <span className="text-black/80 dark:text-gray-400 w-[80px]">
              Điện thoại
            </span>
            <span className="text-black dark:text-white font-medium">
              Đang cập nhật
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
