import './header.css';
function Header() {
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