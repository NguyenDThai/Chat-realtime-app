import { useData } from "@/hooks/useData";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { createChatListApi } from "@/src/api/chat.list.api";
import { getAllUserApi } from "@/src/api/user.api";
import type { UserType } from "@/types/user.type";
import { Camera, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import ChatAvatar from "@/components/share/ChatAvatar"; // Import ChatAvatar

const CreateChatRoom = ({ onClose }: { onClose: () => void }) => {
  const { fetchChatList } = useData();
  const [roomName, setRoomName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [usersList, setUsersList] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const data = await getAllUserApi();
        setUsersList(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllUser();
  }, []);

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string); // Lưu chuỗi Base64 vào state selectedAvatar
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleUser = (user: UserType) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleClose = () => {
    setRoomName("");
    setSelectedAvatar(null);
    setSelectedUsers([]);
    setSearchTerm("");
    onClose();
  };

  const filteredUsers = usersList?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast.warn("Vui lòng nhập tên phòng chat");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.warn("Vui lòng chọn ít nhất 2 người");
      return;
    }

    try {
      let avatarUrl = "";

      if (imageFile) {
        avatarUrl = await uploadToCloudinary(imageFile);
      }

      const newRoom = await createChatListApi({
        type: "group",
        name: roomName.trim(),
        members: selectedUsers.map((u) => u._id),
        avatar: avatarUrl,
      });

      if (newRoom) {
        fetchChatList();
        handleClose();
        toast.success("Tạo phòng chat thành công!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Không thể tạo phòng chat, vui lòng thử lại!");
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in select-none">
      <div className="relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-slate-200 dark:border-zinc-800 transition-colors">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-zinc-800/50 p-6 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Tạo phòng chat mới
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Tạo nhóm chat và mời bạn bè tham gia
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-zinc-900 transition-colors">
          <form
            id="create-room-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Ảnh đại diện nhóm */}
            <div className="flex flex-col items-center space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-white self-start">
                Ảnh đại diện nhóm
              </label>

              <div className="relative group">
                {/* Input File ẩn đi */}
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Khung Click Upload */}
                <label
                  htmlFor="avatar-upload"
                  className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-primary-theme dark:hover:border-primary-theme-dark group-hover:shadow-[0_0_15px_var(--color-theme-primary)]"
                >
                  {selectedAvatar ? (
                    <img
                      src={selectedAvatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 dark:text-white/50 group-hover:text-primary-theme dark:group-hover:text-primary-theme-dark transition-colors duration-200">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] tracking-wide font-medium">
                        Tải ảnh lên
                      </span>
                    </div>
                  )}
                </label>

                {/* Nút Xóa ảnh */}
                {selectedAvatar && (
                  <button
                    type="button"
                    onClick={() => setSelectedAvatar(null)}
                    className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-lg transition-all duration-200 cursor-pointer hover:scale-110"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tên nhóm */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-white">
                Tên nhóm{" "}
                <span className="text-primary-theme dark:text-primary-theme-dark">
                  *
                </span>
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Nhập tên nhóm của bạn"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-2 focus:ring-[var(--color-theme-primary)]/50 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
                autoFocus
              />
            </div>

            {/* Selected members preview */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800 dark:text-white">
                  Thành viên đã chọn
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-primary-theme/10 dark:bg-primary-theme-dark/15 border border-primary-theme/30 dark:border-primary-theme-dark/30 rounded-xl"
                    >
                      <span className="text-slate-850 dark:text-white text-sm">
                        {user.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleUser(user)}
                        className="hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-full p-0.5"
                      >
                        <X className="w-3.5 h-3.5 text-slate-500 dark:text-white/70" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chọn thành viên */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-800 dark:text-white">
                  Thành viên{" "}
                  <span className="text-primary-theme dark:text-primary-theme-dark">
                    *
                  </span>
                </label>
                <span className="text-xs text-slate-500 dark:text-white/60">
                  Đã chọn: {selectedUsers.length} thành viên
                </span>
              </div>

              {/* Search user */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm thành viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-2 focus:ring-[var(--color-theme-primary)]/50 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 text-sm"
                />
                <Search className="w-4 h-4 text-slate-400 dark:text-white/50 absolute left-3 top-2.5" />
              </div>

              {/* Danh sách user */}
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {filteredUsers.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => handleToggleUser(user)}
                    className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                      selectedUsers.find((u) => u._id === user._id)
                        ? "bg-[var(--color-theme-primary)]/10 dark:bg-[var(--color-theme-primary-dark)]/15 border border-[var(--color-theme-primary)]/40 dark:border-[var(--color-theme-primary-dark)]/40"
                        : "bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar user */}
                      <ChatAvatar user={user} className="w-10 h-10 text-sm" />

                      {/* Thông tin user */}
                      <div className="text-left">
                        <p className="text-slate-850 dark:text-white font-semibold text-sm">
                          {user.name}
                        </p>
                        <p className="text-slate-500 dark:text-white/50 text-xs">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Checkbox tùy chỉnh */}
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedUsers.find((u) => u._id === user._id)
                          ? "bg-[var(--color-theme-primary)] border-[var(--color-theme-primary)]"
                          : "border-slate-300 dark:border-white/30 group-hover:border-[var(--color-theme-primary)]"
                      }`}
                    >
                      {selectedUsers.find((u) => u._id === user._id) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-white/50">
                      Không tìm thấy thành viên nào
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer buttons */}
        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/30">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-750 rounded-xl text-slate-700 dark:text-white font-semibold hover:bg-slate-200/50 dark:hover:bg-zinc-700 transition-all duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="create-room-form"
              className="flex-1 px-4 py-2 bg-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-hover)] rounded-xl text-white font-semibold transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-primary-theme/30 cursor-pointer"
            >
              Tạo phòng
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CreateChatRoom;
