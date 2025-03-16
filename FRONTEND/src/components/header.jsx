import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/header.scss";

function Header() {
  const navigate = useNavigate();
  
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

  return (
    <header className="header">
      <div className="header--contents">
        <i className="fa-solid fa-flag header--logo"></i>
        <span className="logo--name">Green Flag</span>
      </div>
      <div className="header--buttons">
        <button onClick={() => navigate("/missions")}>Nhiệm vụ</button>
        <button onClick={() => navigate("/market")}>Chợ trao đổi</button>
        <button onClick={() => navigate("/register")}>Đăng kí</button>
        <button onClick={() => navigate("/login")}>Đăng nhập</button>
      </div>
      <div className="header--underlay"></div>
    </header>
  );
}

export default Header;
