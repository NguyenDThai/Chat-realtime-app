import { createBrowserRouter } from "react-router-dom";
import Home from "@/src/pages/home/Home";
import Login from "@/src/pages/login/Login";
import Register from "@/src/pages/register/Register";
import PublicRoute from "@/src/routes/PublicRoute";
import ProtectedRoute from "@/src/routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
]);
