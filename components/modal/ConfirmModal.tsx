import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info"; // Màu sắc chủ đạo của nút xác nhận
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "danger",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  // Xác định màu sắc của nút Xác nhận dựa trên type
  const confirmBtnStyles = {
    danger:
      "bg-rose-500 hover:bg-rose-600 active:bg-rose-700 shadow-rose-500/20",
    warning:
      "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 shadow-amber-500/20",
    info: "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 shadow-emerald-500/20",
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay làm mờ background */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Hộp thoại Modal */}
      <div className="relative w-full max-w-md bg-emerald-950/95 border border-white/20 rounded-2xl p-6 text-white shadow-2xl transform scale-100 transition-all duration-300 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
        {/* Tiêu đề */}
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

        {/* Nội dung tin nhắn */}
        <p className="text-sm text-white/80 leading-relaxed mb-6">{message}</p>

        {/* Nút hành động */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg cursor-pointer transition-all duration-200 ${confirmBtnStyles}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
