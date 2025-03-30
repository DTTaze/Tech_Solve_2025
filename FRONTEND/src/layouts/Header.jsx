import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import { notification } from "antd";
import { getUserApi } from "../utils/api";
import { Coins } from "lucide-react";

function UserHeader() {
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current?.contains(event.target) ||
        menuButtonRef.current?.contains(event.target)
      ) {
        return;
      }
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    notification.success({ message: "Đăng xuất thành công" });
    setAuth({ isAuthenticated: false, user: null });
    navigate("/");
  };

  const pages = [
    { key: "", label: "Trang chủ" },
    { key: "missions", label: "Nhiệm vụ" },
    { key: "market", label: "Chợ trao đổi" },
    { key: "mission-video", label: "Video ngắn" },
    { key: "news", label: "Tin tức" },
  ];

  return (
    <header className="w-full px-5 pt-2 flex justify-between items-center bg-white z-10">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <img
          src="../src/assets/images/Logo-Greenflag.png"
          className="w-10 h-10 md:w-12 md:h-12"
          alt="Logo"
        />
        <span className="text-lg md:text-2xl font-bold ml-2 text-[#0B6E4F]">
          Green Flag
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-6">
        {pages.map(({ key, label }) => (
          <button key={key} className="font-bold hover:text-[#62C370] text-lg cursor-pointer" onClick={() => navigate(`/${key}`)}>
            {label}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      {auth.isAuthenticated ? (
        <div className="relative z-10" ref={profileMenuRef}>
          <div className="hidden md:flex items-center cursor-pointer" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            <img src={auth.user?.avatar || "../src/assets/images/default-avatar.jpg"} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover" />
          </div>
          {profileMenuOpen && (
            <div className="absolute right-0 bg-[#0B6E4F] rounded-lg shadow-lg p-2 w-40 mt-2">
              <p className="p-2 font-bold text-white">{auth.user.username}</p>
              <div className="flex items-center">
                <Coins className="h-6 w-6 text-amber-600 mr-2" />
                <span className="font-medium text-white">: {user?.coins}</span>
              </div>
              <button className="w-full p-2 text-left hover:text-[#62C370] font-bold cursor-pointer" onClick={() => navigate("/profile")}>Xem Hồ Sơ</button>
              <button className="w-full p-2 text-left hover:text-[#62C370] font-bold cursor-pointer" onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:flex gap-3">
          <button className="text-lg font-bold hover:text-[#62C370] cursor-pointer" onClick={() => navigate("/register")}>Đăng ký</button>
          <button className="text-lg font-bold hover:text-[#62C370] cursor-pointer" onClick={() => navigate("/login")}>Đăng nhập</button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button ref={menuButtonRef} className="md:hidden text-2xl cursor-pointer z-20" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 w-full h-screen bg-[#0B6E4F] transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col items-center justify-center text-white z-10`}
      >
        {pages.map(({ key, label }) => (
          <button key={key} className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer" onClick={() => { navigate(`/${key}`); setMenuOpen(false); }}>
            {label}
          </button>
        ))}
        {!auth.isAuthenticated ? (
          <>
            <button className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer" onClick={() => navigate("/register")}>Đăng ký</button>
            <button className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer" onClick={() => navigate("/login")}>Đăng nhập</button>
          </>
        ) : (
          <>
            <button className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer" onClick={() => navigate("/profile")}>Xem hồ sơ</button>
            <button className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer" onClick={handleLogout}>Đăng xuất</button>
          </>
        )}
      </div>
    </header>
  );
}

export default UserHeader;
