import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function AdminRoute({ children }) {
  const { authUser } = useAuthStore();

  if (!authUser) return <Navigate to="/login" replace />;
  if (!authUser.isVerified) return <Navigate to="/verify-email" replace />;
  if (authUser.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
