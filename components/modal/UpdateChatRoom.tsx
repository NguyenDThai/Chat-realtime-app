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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <form
        id="update-room-form"
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/20"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/50 to-teal-600/50 p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Chỉnh sửa phòng chat
              </h2>
              <p className="text-emerald-200 text-sm mt-1">
                Thay đổi ảnh, tên và thành viên của nhóm
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          {/* Avatar upload */}
          <div className="flex flex-col items-center space-y-2">
            <label className="block text-sm font-semibold text-white self-start">
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
                className="w-24 h-24 rounded-2xl bg-white/5 border border-white/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-white/10 hover:border-emerald-400"
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
                        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center text-white/50">
                    <Camera className="w-8 h-8 mb-1" />
                    <span className="text-[10px]">Tải ảnh lên</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Tên nhóm */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Tên nhóm
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
            />
          </div>

          {/* Chọn thành viên */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Thành viên
            </label>
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Tìm kiếm thành viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white/10 border border-white/20 rounded-xl text-white"
              />
              <Search className="w-4 h-4 text-white/50 absolute left-3 top-2.5" />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {filteredUsers.map((member) => (
                <div
                  key={member._id}
                  className="w-full p-3 rounded-xl flex items-center justify-between border bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar thành viên */}
                    <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white text-xs font-bold uppercase border border-white/20">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </div>
                    {/* Tên thành viên */}
                    <span className="text-white text-sm font-medium">
                      {member.name}
                    </span>
                  </div>
                  {/* Nút xóa thành viên */}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(member)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-all duration-200 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-white/40 text-xs py-4">
                  Không tìm thấy thành viên nào
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-white/10 rounded-xl text-white"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="update-room-form"
            className="flex-1 py-2 bg-emerald-500 rounded-xl text-white"
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
