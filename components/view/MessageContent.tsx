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

  if (content.length <= maxLength) {
    return <p className="text-sm break-words whitespace-pre-wrap">{content}</p>;
  }
  return (
    <div>
      <p className="text-sm break-words whitespace-pre-wrap">
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
