import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../../contexts/auth.context.jsx";
import {
  uploadUserAvatarApi,
  updateUserAvatarApi,
  getUserAvatarByIdApi,
} from "../../../utils/api.js";
import Loader from "../../ui/Loader.jsx";

function MenuItem({ text, onClick }) {
  return (
    <div
      className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-sm text-gray-700 flex-1">{text}</span>
    </div>
  );
}

function ProfileCard({ setSelectedTab }) {
  const { auth, appLoading, setAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (!isFetched && auth?.user?.id) {
      setIsFetched(true);
      (async () => {
        try {
          const response = await getUserAvatarByIdApi(auth.user.id);
          if (response?.data?.avatar_url) {
            const avatarUrl = `${response.data.avatar_url}?t=${Date.now()}`;
            setAvatar(avatarUrl);
            setAuth(prev => ({
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

  if (appLoading) return <Loader></Loader>;
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
        setAuth(prev => ({
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

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md border">
      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        <div className="relative flex h-20 w-20 sm:h-16 sm:w-16 shrink-0">
          <img
            key={avatarUrl} // ép React re-render ảnh ngay khi URL thay đổi
            alt="Avatar"
            className={`h-full w-full rounded-lg object-cover cursor-pointer ${loading ? "opacity-50" : "opacity-100"}`}
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
          <p className="text-xs text-gray-600">{user?.email || "No email available"}</p>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b"></div>
      <div className="space-y-2">
        {["Thông tin cá nhân", "Nhiệm vụ hoàn thành", "Đơn mua"].map(tab => (
          <MenuItem key={tab} text={tab} onClick={() => setSelectedTab(tab)} />
        ))}
      </div>
    </div>
  );
}

export default ProfileCard;
