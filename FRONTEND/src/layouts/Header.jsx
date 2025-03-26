import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth.context";
import { notification } from "antd";

function UserHeader() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".user-header");
      const header_underplay = document.querySelector(".header-underlay");
  
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("shadow-md");
          header_underplay.classList.add("translate-y-0"); // Hiển thị
          header_underplay.classList.remove("-translate-y-full"); // Xóa class ẩn
        } else {
          header.classList.remove("shadow-md");
          header_underplay.classList.add("-translate-y-full"); // Ẩn đi khi về đầu trang
          header_underplay.classList.remove("translate-y-0");
        }
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-profile") && !event.target.closest(".hamburger")) {
        setProfileMenuOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    notification.success({ message: "Đăng xuất thành công" });
    setAuth({ isAuthenticated: false, user: null });
    navigate("/");
  };

  return (
    <header className="user-header w-full px-5 py-3 fixed top-0 left-0 flex justify-between items-center z-10">
      {/* === 1. Logo + Tên Website === */}
      <div
        className="flex items-center cursor-pointer select-none z-10"
        onClick={() => navigate("/")}
      >
        <img
          src="../src/assets/images/Logo-Greenflag.png"
          className="w-12 h-12"
          alt="Logo"
        />
        <span className="text-xl md:text-2xl font-bold ml-2 text-[#0B6E4F] whitespace-nowrap">
          Green Flag
        </span>
      </div>

      {/* === 2. Thanh điều hướng (chỉ hiện trên màn hình lớn) === */}
      <nav className="hidden md:flex space-x-6 gap-3 z-10">
        <button
          className="font-bold hover:text-[#62C370] !text-lg"
          onClick={() => navigate("/missions")}
        >
          Nhiệm vụ
        </button>
        <button
          className="!text-lg font-bold  hover:text-[#62C370]"
          onClick={() => navigate("/market")}
        >
          Chợ trao đổi
        </button>
        <button
          className="!text-lg font-bold  hover:text-[#62C370]"
          onClick={() => navigate("/news")}
        >
          Tin tức
        </button>
      </nav>

      {/* === 3. Đăng nhập / Avatar User === */}
      {auth.isAuthenticated ? (
        <div className="relative user-profile z-10">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <img
              src={auth.user?.avatar || "../src/assets/images/default-avatar.jpg"}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
            />
          </div>
          {profileMenuOpen && (
            <div className="absolute right-0 bg-[#0B6E4F] rounded-lg shadow-lg p-2 w-40 mt-2">
              <p className="p-2 font-bold ">{auth.user.username}</p>
              <button
                className="w-full p-2 text-left  hover:text-[#62C370] rounded"
                onClick={() => navigate("/profile")}
              >
                Xem hồ sơ
              </button>
              <button
                className="w-full p-2 text-left  hover:text-[#62C370] rounded"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-3 z-10">
          <button
            className="!text-lg font-bold  hover:text-[#62C370]"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
          <button
            className="!text-lg font-bold  hover:text-[#62C370]"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      )}

      {/* === 4. Nút menu hamburger trên mobile === */}
      <div className="md:hidden">
        <button
          className="hamburger text-2xl  focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* === 5. Menu mobile dropdown === */}
      {menuOpen && (
        <nav className="absolute top-14 right-0 bg-[#0B6E4F] shadow-lg rounded-lg p-3 w-40 flex flex-col md:hidden">
          <button className="text-lg font-bold  hover:text-[#62C370]" onClick={() => navigate("/missions")}>
            Nhiệm vụ
          </button>
          <button className="text-lg font-bold  hover:text-[#62C370]" onClick={() => navigate("/market")}>
            Chợ trao đổi
          </button>
          <button className="text-lg font-bold  hover:text-[#62C370]" onClick={() => navigate("/news")}>
            Tin tức
          </button>
          {!auth.isAuthenticated ? (
            <>
              <button className="text-lg font-bold  hover:text-[#62C370]" onClick={() => navigate("/register")}>
                Đăng ký
              </button>
              <button className="text-lg font-bold  hover:text-[#62C370]" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
            </>
          ) : (
            <>
              <button className="text-lg font-bold  hover:text-[#62C370]" onClick={() => navigate("/profile")}>
                Xem hồ sơ
              </button>
              <button className="text-lg font-bold  hover:text-[#62C370]" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          )}
        </nav>
      )}
      <div className="header-underlay w-full h-full z-1 absolute bg-[#74dc2e] top-0 left-0 -translate-y-full transition-transform duration-300">
      </div>
    </header>
  );
}

export default UserHeader;
