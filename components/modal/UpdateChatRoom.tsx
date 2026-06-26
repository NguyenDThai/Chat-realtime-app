import { useState, useEffect, type FC } from "react";
import type { ChatListType } from "@/types/list.chat.type";
import type { UserType } from "@/types/user.type";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Camera, Search, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { updateChatListApi } from "@/src/api/chat.list.api";
import { useAuth } from "@/hooks/useAuth";
import { useConfirm } from "@/hooks/useConfirm";
import ChatAvatar from "@/components/share/ChatAvatar";

interface UpdateChatRoomProps {
  room: ChatListType;
  onClose: () => void;
  fetchChatList: () => void;
}

const UpdateChatRoom: FC<UpdateChatRoomProps> = ({
  room,
  onClose,
  fetchChatList,
}) => {
  // Điền sẵn tên nhóm cũ và avatar cũ
  const [roomName, setRoomName] = useState(room.name || "");
  const [selectedAvatar, setSelectedAvatar] = useState(room.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Điền sẵn danh sách thành viên cũ (loại trừ tài khoản của chính mình)
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const { user: currentUser } = useAuth();
  const confirm = useConfirm();

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        // Lấy danh sách thành viên từ room đang sửa (loại trừ người dùng hiện tại đang đăng nhập)
        const currentMembers = room.members.filter(
          (m) => m._id !== room.createdBy._id,
        );
        setSelectedUsers(currentMembers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUser();
  }, [room]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Xem trước ảnh cục bộ
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 2. Upload ngay lên Cloudinary ở background
      try {
        setIsUploading(true);
        const url = await uploadToCloudinary(file);
        setSelectedAvatar(url); // Lưu URL chính thức từ Cloudinary
      } catch (error) {
        console.error(error);
        toast.error("Tải ảnh lên thất bại!");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.warn("Tên phòng chat không được để trống!");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.warn("Vui lòng chọn ít nhất 2 thành viên khác!");
      return;
    }

    if (isUploading) {
      toast.info("Đang tải ảnh đại diện lên...");
      return;
    }

    try {
      const updatedRoom = await updateChatListApi(room._id, {
        name: roomName.trim(),
        avatar: selectedAvatar,
        members: selectedUsers.map((u) => u._id),
      });

      if (updatedRoom) {
        fetchChatList();
        onClose();
        toast.success("Cập nhật phòng chat thành công!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thất bại, vui lòng thử lại!");
    }
  };

  const handleRemoveUser = async (userToRemove: UserType) => {
    const isAdmin = currentUser?._id === room.createdBy._id;
    if (!isAdmin) {
      toast.error("Bạn không có quyền xóa thành viên!");
      return;
    }
    if (userToRemove._id === room.createdBy._id) {
      toast.error("Không thể xóa trưởng nhóm!");
      return;
    }

    if (selectedUsers.length <= 2) {
      toast.error("Không thể xóa thành viên, phải còn ít nhất 2 thành viên!");
      return;
    }
    // Hộp thoại dailog custom
    const isConfirmed = await confirm({
      title: "Xóa thành viên",
      message: `Bạn có chắc muốn xóa thành viên "${userToRemove.name}" khỏi nhóm không?`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
    });
    if (!isConfirmed) return;
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  const filteredUsers = selectedUsers?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in select-none">
      <form
        id="update-room-form"
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-zinc-800 transition-colors"
      >
        {/* Header */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Chỉnh sửa phòng chat
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Thay đổi ảnh, tên và thành viên của nhóm
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white dark:bg-zinc-900 transition-colors">
          {/* Avatar upload */}
          <div className="flex flex-col items-center space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-white self-start">
              Ảnh đại diện nhóm
            </label>
            <div className="relative">
              <input
                type="file"
                id="avatar-update-input"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="avatar-update-input"
                className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-slate-100 dark:hover:bg-white/10 hover:border-[var(--color-theme-primary)] dark:hover:border-[var(--color-theme-primary-dark)] group-hover:shadow-[0_0_15px_var(--color-theme-primary)]"
              >
                {selectedAvatar ? (
                  <>
                    <img
                      src={selectedAvatar}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-primary-theme border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 dark:text-white/50 transition-colors duration-200">
                    <Camera className="w-8 h-8 mb-1" />
                    <span className="text-[10px]">Tải ảnh lên</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Tên nhóm */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-white">
              Tên nhóm
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-2 focus:ring-[var(--color-theme-primary)]/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
            />
          </div>

          {/* Chọn thành viên */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-white">
              Thành viên
            </label>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Tìm kiếm thành viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-2 focus:ring-[var(--color-theme-primary)]/50 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-white/50 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredUsers.map((member) => (
                <div
                  key={member._id}
                  className="w-full p-3 rounded-xl flex items-center justify-between border bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar thành viên */}
                    <ChatAvatar user={member} className="w-8 h-8 text-xs" />
                    {/* Tên thành viên */}
                    <span className="text-slate-800 dark:text-white text-sm font-medium">
                      {member.name}
                    </span>
                  </div>
                  {/* Nút xóa thành viên */}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(member)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-slate-500 dark:text-white/60 hover:text-red-400 transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-slate-500 dark:text-white/40 text-xs py-4">
                  Không tìm thấy thành viên nào
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 dark:bg-zinc-800 border dark:border-zinc-750 rounded-xl text-slate-700 dark:text-white font-semibold hover:bg-slate-200/50 dark:hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="update-room-form"
            className="flex-1 py-2 bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-[var(--color-theme-primary)]/30 cursor-pointer"
          >
            Cập nhật
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default UpdateChatRoom;
