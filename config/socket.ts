import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_API_URL.replace("/api", "");

export const socket = io(SERVER_URL, {
  autoConnect: false, //Chi connect khi nguoi dung dang nhap,
});
