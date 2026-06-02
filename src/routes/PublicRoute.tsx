import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();

  // Đợi AuthProvider xác thực xong
  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Đang tải thông tin xác thực...
      </div>
    );
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
