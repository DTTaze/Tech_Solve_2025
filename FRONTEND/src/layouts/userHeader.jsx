import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../layouts/auth.context";
import { notification } from "antd";
import "../styles/components/header.css";

function Header() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("header--sticky");
        } else {
          header.classList.remove("header--sticky");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-profile")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    notification.success({ message: "Logout success" });
    setAuth({ isAuthenticated: false, user: null });
    navigate("/");
  };

  return (
    <header className="header fixed top-0 left-0 w-full h-14 flex justify-between items-center px-5 z-10 transition-all duration-300 ease-in-out translate-y-0">
      <div
        className="flex z-10 items-center cursor-pointer select-none"
        onClick={() => {
          navigate("/");
          window.scrollTo(0, 0);
        }}
      >
        <i className="fa-solid fa-flag text-2xl mr-2"></i>
        <span className="text-3xl font-bold">Green Flag</span>
      </div>

      <div className="flex z-10 items-center space-x-4">
        <button
          className="text-lg font-bold hover:text-green-500"
          onClick={() => navigate("/missions")}
        >
          Nhiệm vụ
        </button>
        <button
          className="text-lg font-bold hover:text-green-500"
          onClick={() => navigate("/market")}
        >
          Chợ trao đổi
        </button>
        {auth.isAuthenticated ? (
          <div
            className="relative user-profile cursor-pointer flex items-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img
              src={
                auth.user?.avatar || "../src/assets/photos/default-avatar.jpg"
              }
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
            />
            {menuOpen && (
              <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg p-2 min-w-[150px] flex flex-col transition-all duration-300 ease-in-out opacity-100 scale-100">
                <p className="p-2 font-bold border-b border-gray-200">
                  {auth.user.username}
                </p>
                <button
                  className="w-full p-2 text-left hover:bg-gray-100"
                  onClick={handleProfileClick}
                >
                  Xem hồ sơ
                </button>
                <button
                  className="w-full p-2 text-left hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="text-lg font-bold hover:text-green-500"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
            <button
              className="text-lg font-bold hover:text-green-500"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          </>
        )}
      </div>
      <div className="header--underlay"></div>
    </header>
  );
}

export default Header;
