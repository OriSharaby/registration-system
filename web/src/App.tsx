import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";


export default function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}