import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../../contexts/auth.context.jsx";
import {
  uploadUserAvatarApi,
  updateUserAvatarApi,
  getUserAvatarByIdApi,
} from "../../../utils/api.js";

function MenuItem({ text, onClick, hasSubmenu, isOpen, children }) {
  return (
    <div>
      <div
        className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
        onClick={onClick}
      >
        <span className="text-sm text-gray-700 flex-1">{text}</span>
        {hasSubmenu && (
          <svg
            className={`w-4 h-4 transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      {hasSubmenu && isOpen && (
        <div className="ml-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function SubMenuItem({ text, onClick }) {
  return (
    <div
      className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
}

function ProfileCard({ setSelectedTab }) {
  const { auth, setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const [isFetched, setIsFetched] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    if (!isFetched && auth?.user?.id) {
      setIsFetched(true);
      (async () => {
        try {
          const response = await getUserAvatarByIdApi(auth.user.id);
          if (response?.data?.avatar_url) {
            const avatarUrl = `${response.data.avatar_url}?t=${Date.now()}`;
            setAvatar(avatarUrl);
            setAuth((prev) => ({
              ...prev,
              user: { ...prev.user, avatar_url: avatarUrl },
            }));
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      })();
    }
  }, [auth?.user?.id, isFetched, setAuth]);

  if (!auth.isAuthenticated) return <p>User not logged in.</p>;

  const { user } = auth;

  const avatarUrl = avatar
    ? avatar
    : user?.avatar_url
    ? `${user.avatar_url}?t=${Date.now()}`
    : "../src/assets/images/default-avatar.jpg";

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const response = user.avatar_url
        ? await updateUserAvatarApi(user.id, file)
        : await uploadUserAvatarApi(user.id, file);
      if (response?.data?.avatar_url) {
        const updatedUrl = `${response.data.avatar_url}?t=${Date.now()}`;
        setAvatar(updatedUrl);
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, avatar_url: updatedUrl },
        }));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const accountSubmenuItems = [
    { text: "Xem hồ sơ", tab: "Xem hồ sơ" },
    { text: "Địa chỉ", tab: "Địa chỉ" },
    { text: "Đổi mật khẩu", tab: "Đổi mật khẩu" },
    { text: "Xóa tài khoản", tab: "Xóa tài khoản" },
  ];

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        <div className="relative flex h-20 w-20 sm:h-16 sm:w-16 shrink-0">
          <img
            key={avatarUrl}
            alt="Avatar"
            className={`h-full w-full rounded-lg object-cover cursor-pointer ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            src={avatarUrl}
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col flex-1 break-words">
          <h2 className="text-base font-semibold">{user?.full_name || "null"}</h2>
          <p className="text-xs text-gray-600">
            {user?.email || "No email available"}
          </p>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b"></div>
      <div className="space-y-2">
        <MenuItem
          text="Tài khoản của tôi"
          hasSubmenu
          isOpen={isAccountMenuOpen}
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
        >
          {accountSubmenuItems.map(({ text, tab }) => (
            <SubMenuItem
              key={text}
              text={text}
              onClick={() => setSelectedTab(tab)}
            />
          ))}
        </MenuItem>
        <MenuItem
          text="Nhiệm vụ hoàn thành"
          onClick={() => setSelectedTab("Nhiệm vụ hoàn thành")}
        />
        <MenuItem
          text="Đơn mua"
          onClick={() => setSelectedTab("Đơn mua")}
        />
      </div>
    </div>
  );
}

export default ProfileCard;