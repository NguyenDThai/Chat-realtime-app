import { createBrowserRouter } from "react-router-dom";
import Home from "@/src/pages/home/Home";
import Login from "@/src/pages/login/Login";
import Register from "@/src/pages/register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
