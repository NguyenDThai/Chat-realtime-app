import { Download, FileText } from "lucide-react";
import { useState } from "react";

const MessageContent = ({
  content,
  isMe,
}: {
  content: string;
  isMe: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 500;

  const isImageURL = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return false;
    }

    const nonImageExtensions =
      /\.(pdf|docx|doc|xlsx|xls|pptx|ppt|zip|rar|txt|csv|mp3|mp4|wav|avi|mov)$/i;

    if (nonImageExtensions.test(url)) {
      return false;
    }

    return (
      url.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|jfif)/i) != null ||
      (url.includes("cloudinary.com") && url.includes("/image/upload/"))
    );
  };

  const isUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const getFileName = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const filename = decodedUrl.substring(decodedUrl.lastIndexOf("/") + 1);
      return filename || "Tài liệu đính kèm";
    } catch (error) {
      return "Tài liệu đính kèm";
    }
  };

  // Hiển thị hình ảnh
  if (isImageURL(content)) {
    return (
      <div className="max-w-sm rounded-2xl overflow-hidden my-1 border border-slate-200/50 dark:border-zinc-800 shadow-md bg-slate-100 dark:bg-zinc-800">
        <img
          src={content}
          alt="Hình ảnh gửi đi"
          className="w-full h-auto max-h-72 object-cover hover:scale-[1.02] transition-transform duration-300 cursor-zoom-in"
          onClick={() => window.open(content, "_blank")}
        />
      </div>
    );
  }

  // Hiển thị file
  if (isUrl(content)) {
    const fileName = getFileName(content);
    return (
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl max-w-xs shadow-sm hover:shadow-md transition-all duration-200 my-1">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Icon tài liệu màu xanh ngọc đồng bộ với theme */}
          <div className="p-2.5 bg-[var(--color-theme-primary)]/10 text-[var(--color-theme-primary)] rounded-xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="text-left min-w-0">
            <p
              className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[150px]"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase mt-0.5">
              Tài liệu đính kèm
            </p>
          </div>
        </div>

        {/* Nút tải xuống */}
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="p-2 hover:bg-slate-250/60 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 rounded-xl transition-all duration-200 shrink-0 cursor-pointer hover:scale-105 ml-3"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>
    );
  }

  if (content.length <= maxLength) {
    return <p className="text-sm break-all whitespace-pre-wrap">{content}</p>;
  }
  return (
    <div className="py-3">
      <p className="text-sm break-all whitespace-pre-wrap">
        {isExpanded ? content : `${content.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`text-sm font-bold mt-1 underline hover:no-underline transition-colors duration-200 block cursor-pointer ${
          isMe
            ? "text-emerald-100 hover:text-white"
            : "text-emerald-400 hover:text-emerald-300"
        }`}
      >
        {isExpanded ? "Thu gọn" : "Xem thêm"}
      </button>
    </div>
  );
};

export default MessageContent;
