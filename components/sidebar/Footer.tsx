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
    <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-100/50 dark:bg-zinc-950">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-[var(--color-theme-primary)] dark:bg-[var(--color-theme-primary)] rounded-xl flex items-center justify-center">
          <User className="text-white" size={20} />
        </div>
        <div className="flex-1">
          <p className="text-slate-800 dark:text-white font-semibold text-sm">
            {user?.name}
          </p>
          <p className="text-[var(--color-theme-primary)] dark:text-[var(--color-theme-primary)] text-xs">
            {user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="text-slate-700 dark:text-white" size={20} />
        </button>
      </div>
    </div>
  );
};

export default Footer;
