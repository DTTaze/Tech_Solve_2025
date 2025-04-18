import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/SocialLoginIcons.css";
import { AuthContext } from "../../contexts/auth.context";
import { useNotification } from "../ui/NotificationProvider";

const SocialLoginIcons = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { notify } = useNotification();

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login/google`);
      const data = await response.json();

      if (data && data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        
        notify("success", "Đăng nhập thành công!");

        setAuth({
          isAuthenticated: true,
          user: {
            email: data.user?.email ?? "",
            username: data.user?.username ?? "",
          },
        });
        navigate("/");
      } else {
        notify("error", "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      notify("error", error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <ul className="wrapper flex gap-4 justify-center my-4">
      <li 
        className="icon gmail flex flex-col items-center cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <span className="tooltip text-sm">Gmail</span>
        <i className="fab fa-google text-lg"></i>
      </li>

      <li className="icon apple flex flex-col items-center cursor-pointer">
        <span className="tooltip text-sm">Apple</span>
        <i className="fab fa-apple text-lg"></i>
      </li>

      <li className="icon facebook flex flex-col items-center cursor-pointer">
        <span className="tooltip text-sm">Facebook</span>
        <i className="fab fa-facebook-f text-lg"></i>
      </li>
    </ul>
  );
};

export default SocialLoginIcons;
