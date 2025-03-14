import { useEffect } from "react";
import "../components/header.css";

function Header() {
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
    <div>
      <header className="header">
        <div className="header--contents">
          <i className="fa-solid fa-flag header--logo"></i>
          <span className="logo--name">Green Flag</span>
        </div>
        <div className="header--buttons">
          <button>Nhiệm vụ</button>
          <button>Chợ trao đổi</button>
          <button>Đăng kí</button>
          <button>Đăng nhập</button>
        </div>
        <div className="header--underlay"></div>
      </header>
    </div>
  );
}

export default Header;
