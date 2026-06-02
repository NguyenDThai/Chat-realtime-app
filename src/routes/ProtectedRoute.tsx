import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();

  // Đợi AuthProvider xác thực token với backend xong
  if (loading) {
    return (
      <div className="text-white text-center mt-20">
        Đang tải thông tin xác thực...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
