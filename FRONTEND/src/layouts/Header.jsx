import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth.context";
import { notification } from "antd";

function UserHeader() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const userData = auth?.user || {};
  const avatarUrl = userData.avatar_url || "/assets/photos/default-avatar.jpg";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".user-header");
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add("shadow-md");
        } else {
          header.classList.remove("shadow-md");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-profile") && !event.target.closest(".hamburger")) {
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
    <header className="user-header w-screen bg-[#3F7D58] px-5 z-10 fixed top-0 left-0 flex justify-between items-center transition-all duration-300 ease-in-out">
      <div
        className="flex items-center cursor-pointer select-none"
        onClick={() => {
          navigate("/");
          window.scrollTo(0, 0);
        }}
      >
        <img
          src="../src/assets/images/Logo-Greenflag.png"
          className="w-10 h-10"
          alt="Logo"
        />
        <span className="text-xl md:text-2xl font-bold ml-2 whitespace-nowrap">
          Green Flag
        </span>
      </div>

      <div className="md:hidden">
        <button
          className="hamburger text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      <nav
        className={`${ menuOpen ? "flex" : "hidden" } 
        w-[30%] md:flex flex-col md:flex-row items-center justify-evenly absolute md:static top-14 right-0 md:bg-transparent shadow-md md:shadow-none p-3 md:p-0 space-y-4 md:space-y-0 md:space-x-4 z-20 transition-all duration-300`}
      >
        <button
          className="text-lg font-bold text-gray-800 hover:text-green-500 w-full md:w-auto text-left md:text-center"
          onClick={() => {
            navigate("/missions");
            setMenuOpen(false);
          }}
        >
          Nhiệm vụ
        </button>
        <button
          className="text-lg font-bold text-gray-800 hover:text-green-500 w-full md:w-auto text-left md:text-center"
          onClick={() => {
            navigate("/market");
            setMenuOpen(false);
          }}
        >
          Chợ trao đổi
        </button>

        {auth.isAuthenticated ? (
          <div className="relative user-profile w-full md:w-auto">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={
                  auth.user?.avatar || "../src/assets/images/default-avatar.jpg"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
              />
              <span className="ml-2 font-bold text-gray-800 md:hidden truncate max-w-[150px]">
                {auth.user.username}
              </span>
            </div>
            {menuOpen && (
              <div className="md:absolute md:top-12 md:right-0 bg-white rounded-lg shadow-lg p-2 w-full md:w-40 flex flex-col mt-2 md:mt-0 transition-all duration-300 ease-in-out">
                <p className="p-2 font-bold text-gray-800 border-b border-gray-200 md:hidden truncate">
                  {auth.user.username}
                </p>
                <button
                  className="w-full p-2 text-left text-gray-800 hover:bg-gray-100 rounded"
                  onClick={handleProfileClick}
                >
                  Xem hồ sơ
                </button>
                <button
                  className="w-full p-2 text-left text-gray-800 hover:bg-gray-100 rounded"
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
              className="text-lg font-bold text-gray-800 hover:text-green-500 w-full md:w-auto text-left md:text-center"
              onClick={() => {
                navigate("/register");
                setMenuOpen(false);
              }}
            >
              Đăng ký
            </button>
            <button
              className="text-lg font-bold text-gray-800 hover:text-green-500 w-full md:w-auto text-left md:text-center"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              Đăng nhập
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default UserHeader;