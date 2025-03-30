import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../contexts/auth.context.jsx";
import {
  uploadUserAvatarApi,
  updateUserAvatarApi,
  getUserAvatarByIdApi,
} from "../../utils/api.js";

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
  const [avatar, setAvatar] = useState(auth?.user?.avatar_url || "");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!avatar && auth?.user?.id) {
      (async () => {
        try {
          const response = await getUserAvatarByIdApi(auth.user.id);
          if (response?.avatar_url) {
            setAvatar(response.avatar_url);
            setAuth(prev => ({ ...prev, user: { ...prev.user, avatar_url: response.avatar_url } }));
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      })();
    }
  }, [auth?.user?.id, avatar, setAuth]);

  if (appLoading) return <p>Loading user data...</p>;
  if (!auth.isAuthenticated) return <p>User not logged in.</p>;

  const { user } = auth;
  const avatarUrl = avatar || "../src/assets/images/default-avatar.jpg";

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const response = user.avatar_url
        ? await updateUserAvatarApi(user.id, file)
        : await uploadUserAvatarApi(user.id, file);

      if (response?.user?.avatar_url) {
        setAvatar(response.user.avatar_url);
        setAuth(prev => ({ ...prev, user: { ...prev.user, avatar_url: response.user.avatar_url } }));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border">
      <div className="flex space-x-4">
        <div className="relative flex h-20 w-20 shrink-0">
          <img
            alt="Avatar"
            className={`h-20 w-20 rounded-lg object-cover cursor-pointer ${loading ? 'opacity-50' : 'opacity-100'}`}
            src={`${avatarUrl}?t=${Date.now()}`}
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
        <div className="flex flex-col">
          <h2 className="text-base font-semibold break-all">{user?.full_name || "null"}</h2>
          <p className="text-xs">{user?.full_name}</p>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b"></div>
      <div className="space-y-2">
        {["Thông tin cá nhân", "Nhiệm vụ", "Lịch sử giao dịch"].map(tab => (
          <MenuItem key={tab} text={tab} onClick={() => setSelectedTab(tab)} />
        ))}
      </div>
    </div>
  );
}

export default ProfileCard;
