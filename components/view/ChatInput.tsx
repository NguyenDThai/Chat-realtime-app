import { createMessage } from "@/src/api/message.api";
import type { RootState } from "@/src/store";
import { setReplyMessage } from "@/src/store/slides/chatSlide";
import { Paperclip, Smile, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { toast } from "react-toastify";
import type { PreviewFileType } from "@/types/message.type";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [showEmoijPicker, setShowEmoijPicker] = useState(false);
  const emoijPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<PreviewFileType[]>([]);
  const { selectedRoom, replyingMessage } = useSelector(
    (state: RootState) => state.chat,
  );
  const dispatch = useDispatch();

  const EMOJIS = [
    // Cảm xúc
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🥸",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🫣",
    "🤭",
    // Cử chỉ tay
    "👋",
    "🤚",
    "🖐️",
    "✋",
    "🖖",
    "👌",
    "🤌",
    "🤏",
    "✌️",
    "🤞",
    "🫰",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "🖕",
    "👇",
    "☝️",
    "👍",
    "👎",
    "✊",
    "👊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🤝",
    "🙏",
    // Trái tim & Khác
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "🔥",
    "✨",
    "🎉",
    "💯",
    "🚀",
    "⭐",
    "🌟",
    "🎈",
    "🎁",
    "🎂",
    "☕",
    "🍺",
    "🥂",
    "🍕",
    "🐱",
    "🐶",
  ];

  // Xử lsy khi chọn emoij
  const handleSelectedEmoji = (emoij: string) => {
    setText((prev) => prev + emoij);
    inputRef.current?.focus();
  };

  // tự động đóng bảng emoij khi click ra ngoài
  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (
        emoijPickerRef.current &&
        !emoijPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmoijPicker(false);
      }
    };
    if (showEmoijPicker) {
      document.addEventListener("mousedown", handleClickOutSide);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [showEmoijPicker]);

  if (!selectedRoom) return null;

  const handlefileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: PreviewFileType[] = Array.from(files).map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

      return { id, file, previewUrl };
    });

    setSelectedFile((prev) => [...prev, ...newFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = (id: string) => {
    setSelectedFile((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;

    try {
      setIsUploadingFile(true);
      if (selectedFile.length > 0) {
        const toastId = toast.loading(
          `Đang tải lên ${selectedFile.length} file...`,
        );
        const uploadPromise = selectedFile.map(async (item) => {
          const url = await uploadToCloudinary(item.file);
          return await createMessage({
            conversationId: selectedRoom._id,
            content: url,
            replyTo: replyingMessage?._id,
          });
        });
        await Promise.all(uploadPromise);
        toast.update(toastId, {
          render: "Gửi tệp thành công",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });

        // Giải phóng bộ nhớ và xóa hàng chờ file
        selectedFile.forEach((item) => {
          if (item.previewUrl) {
            URL.revokeObjectURL(item.previewUrl);
          }
        });
        setSelectedFile([]);
      }

      if (text.trim()) {
        await createMessage({
          conversationId: selectedRoom._id,
          content: text.trim(),
          replyTo: replyingMessage?._id,
        });
        setText("");
      }

      dispatch(setReplyMessage(null));
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsUploadingFile(false);
    }
  };

  return (
    <div className="p-4 border-t border-[#E5E7EB] dark:border-zinc-800 bg-white dark:bg-[#1A1A1A]">
      {selectedFile.length > 0 && (
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {selectedFile.map((item) => (
            <div
              key={item.id}
              className="relative bg-slate-50 dark:bg-zinc-900/50 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 flex items-center w-fit max-w-[220px] animate-in fade-in zoom-in-95 duration-150"
            >
              {item.previewUrl ? (
                // Nếu là ảnh, hiển thị ảnh nhỏ
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-250 dark:border-zinc-750 shrink-0">
                  <img
                    src={item.previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Nếu là file tài liệu, hiển thị icon kèm thông tin
                <div className="flex items-center space-x-2 px-1 py-0.5 shrink-0">
                  <div className="p-1.5 bg-[var(--color-theme-primary)]/10 text-[var(--color-theme-primary)] rounded-lg">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p
                      className="text-[11px] font-semibold text-slate-755 dark:text-white truncate max-w-[110px]"
                      title={item.file.name}
                    >
                      {item.file.name}
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleDeleteImage(item.id)}
                className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-all duration-150 cursor-pointer hover:scale-110"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-3"
      >
        <button
          type="button"
          className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer"
          disabled={isUploadingFile}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-6 h-6 text-slate-500 dark:text-white/70" />
        </button>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handlefileChange}
          className="hidden"
          accept="image/*,application/pdf,text/*"
        />
        <div className="relative" ref={emoijPickerRef}>
          <button
            type="button"
            className={`${showEmoijPicker ? "bg-[var(--color-theme-primary)]/10" : "hover:bg-slate-100 dark:hover:bg-white/10"} p-2 rounded-xl transition-all duration-200 cursor-pointer`}
            onClick={() => setShowEmoijPicker(!showEmoijPicker)}
          >
            <Smile
              className={`w-6 h-6 ${showEmoijPicker ? "text-[var(--color-theme-primary)]" : "text-slate-500 dark:text-white/70"}`}
            />
          </button>
          {showEmoijPicker && (
            <div className="absolute bottom-full left-0 mb-3 w-72 h-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-850 rounded-2xl shadow-2xl p-3 flex flex-col z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mb-2 px-1">
                Biển tượng cảm xúc
              </div>
              <div className="grid grid-cols-8 gap-1.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {EMOJIS.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectedEmoji(emoji)}
                    className="w-7 h-7 flex items-center justify-center text-lg hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-all cursor-pointer active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Nhập tin nhắn của bạn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-2 py-2 bg-slate-100 dark:bg-zinc-900 border rounded-xl focus:outline-none focus:border-[var(--color-theme-primary)] focus:ring-[var(--color-theme-primary)]/50 transition-all duration-200 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
        />
        <button
          type="submit"
          className="p-3 bg-[var(--color-theme-primary)] rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
