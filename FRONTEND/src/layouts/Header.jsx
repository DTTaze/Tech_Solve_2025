import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import { getUserApi, getUserAvatarByIdApi } from "../utils/api";
import { Coins } from "lucide-react";
import { useNotification } from "../components/ui/NotificationProvider";

function UserHeader() {
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();

  const { notify } = useNotification();

  const fetchUser = async () => {
    try {
      const response = await getUserApi();
      if (
        auth.user &&
        response.data.coins.amount !== auth.user.coins.amount
      ) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: { ...prevAuth.user, coins: response.data.coins },
        }));
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchAvatar = async () => {
    try {
      if (auth?.user?.id && !auth?.user?.avatar_url) {
        const response = await getUserAvatarByIdApi(auth.user.id);
        if (response?.avatar_url) {
          setAuth((prev) => ({
            ...prev,
            user: { ...prev.user, avatar_url: response.avatar_url },
          }));
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy avatar:", error);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchUser();
      fetchAvatar();

      const handleFocus = () => {
        fetchUser();
      };

      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [auth.isAuthenticated, auth.user]);

  useEffect(() => {
    if (profileMenuOpen && auth.isAuthenticated) {
      fetchUser();
    }
  }, [profileMenuOpen]);

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
    setAuth({ isAuthenticated: false, user: null });
    notify("success", "Đăng xuất thành công");
    navigate("/");
  };

  const pages = [
    { key: "", label: "Trang chủ" },
    { key: "missions", label: "Nhiệm vụ" },
    { key: "market", label: "Trao đổi" },
    // { key: "mission-video", label: "Video ngắn" },
  ];

  const avatarUrl =
    (auth.user?.avatar_url || "../src/assets/images/default-avatar.jpg") +
    `?t=${Date.now()}`;

  return (
    <header className="w-full px-5 pt-2 flex justify-between items-center bg-white z-10 relative">
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
      {auth.isAuthenticated && (
        <nav className="hidden md:flex space-x-6">
          {pages.map(({ key, label }) => (
            <button
              key={key}
              className="font-bold hover:text-[#62C370] text-lg cursor-pointer"
              onClick={() => navigate(`/${key}`)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      {/* User Profile */}
      {auth.isAuthenticated ? (
        <div className="relative z-10" ref={profileMenuRef}>
          <div
            className="hidden md:flex items-center cursor-pointer"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
            />
          </div>
          {profileMenuOpen && (
            <div className="absolute right-0 bg-[#f6f5f8] rounded-lg shadow-lg w-48 px-2 py-2">
              <p className="p-2 font-bold">
                Tên người dùng: <br />
                {auth.user.username}
              </p>
              <hr className="border border-gray-300 mb-2" />
              <div className="flex items-center ml-2 py-2">
                <span className="font-bold select-none">
                  Số Coins: {auth.user?.coins?.amount || 0}
                </span>
                <Coins className="h-6 w-6 text-amber-600 ml-2" />
              </div>
              <button
                className="w-full p-2 text-left hover:text-[#62C370] hover:bg-white font-bold rounded-lg cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                Xem Hồ Sơ
              </button>
              <button
                className="w-full p-2 text-left hover:text-[#62C370] hover:bg-white rounded-lg font-bold cursor-pointer"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden md:flex gap-3">
          <button
            className="text-lg font-bold hover:text-[#62C370] cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
          <button
            className="text-lg font-bold hover:text-[#62C370] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        ref={menuButtonRef}
        className="md:hidden text-2xl cursor-pointer z-20"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 w-full h-screen bg-[#0B6E4F] transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col items-center justify-center text-white z-10`}
      >
        {auth.isAuthenticated &&
          pages.map(({ key, label }) => (
            <button
              key={key}
              className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer"
              onClick={() => {
                navigate(`/${key}`);
                setMenuOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        {!auth.isAuthenticated ? (
          <>
            <button
              className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
            <button
              className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
          </>
        ) : (
          <>
            <button
              className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer"
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
            >
              Xem hồ sơ
            </button>
            <button
              className="text-2xl font-bold py-3 hover:text-[#62C370] cursor-pointer"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default UserHeader;
