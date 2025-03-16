import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../layouts/auth.context"; 
import "../styles/components/header.scss";

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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-profile")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({ isAuthenticated: false, user: null });
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header--contents"  onClick={() => {
          navigate("/");
          window.scrollTo(0, 0);
        }}>
        <i className="fa-solid fa-flag header--logo"></i>
        <span className="logo--name">Green Flag</span>
      </div>

      <div className="header--buttons">
        <button onClick={() => navigate("/missions")}>Nhiệm vụ</button>
        <button onClick={() => navigate("/market")}>Chợ trao đổi</button>

        {auth.isAuthenticated ? (
          <div className="user-profile" onClick={() => setMenuOpen(!menuOpen)}>
            <img
              src={auth.user?.avatar || "../src/assets/photos/default-avatar.jpg"} 
              alt="Avatar"
              className="user-avatar"
            />
            {menuOpen && (
              <div className={`dropdown-menu ${menuOpen ? "show" : ""}`}>
                <p>{auth.user.username}</p>
                <button onClick={handleProfileClick}>Xem hồ sơ</button>
                <button onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => navigate("/register")}>Đăng ký</button>
            <button onClick={() => navigate("/login")}>Đăng nhập</button>
          </>
        )}
      </div>
      <div className="header--underlay"></div>
    </header>
  );
}

export default Header;
