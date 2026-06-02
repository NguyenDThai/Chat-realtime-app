import axios from "axios";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";
import type { UserType } from "@/types/user.type";
import { getMeApi } from "@/src/api/auth.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    toast.success("Đăng xuất thành công");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMeApi();
        setUser(res);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data);
        }
      }
    };

    fetchUser();
  }, []);

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
