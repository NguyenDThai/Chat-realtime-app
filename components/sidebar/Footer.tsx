import { LogOut, User } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Footer = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Đăng xuất thành công");
  };

  return (
    <div className="p-4 border-t border-white/20 bg-white/5">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
          <User className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">{user?.name}</p>
          <p className="text-emerald-200 text-xs">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default Footer;
