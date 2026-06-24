import CreateChatRoom from "@/components/modal/CreateChatRoom";
import { MessageSquareMore, UserPlus } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <MessageSquareMore className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-slate-800 dark:text-white font-bold text-lg">Real Chat</h2>
          <p className="text-emerald-600 dark:text-emerald-200 text-xs">Đang online</p>
        </div>
      </div>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all duration-200 cursor-pointer"
      >
        <UserPlus className="w-5 h-5 text-slate-700 dark:text-white" />
      </button>

      {showModal && <CreateChatRoom onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Header;
