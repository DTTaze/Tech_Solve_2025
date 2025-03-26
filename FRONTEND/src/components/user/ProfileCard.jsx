import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../contexts/auth.context.jsx";
import {
  uploadUserAvatarApi,
  updateUserAvatarApi,
  getUserAvatarByIdApi,
} from "../../utils/api.js";

function MenuItem({ text, hasError, onClick }) {
  return (
    <div 
      className="flex items-center p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-sm text-gray-700 flex-1">{text}</span>
      {hasError && <span className="text-red-500 text-lg">&#9888;</span>}
    </div>
  );
}

function ProfileCard({ setSelectedTab }) {
    const { auth, appLoading, setAuth, setAppLoading } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (auth?.user?.avatar_url) {
          setAvatar(auth.user.avatar_url);
        } else if (auth?.user?.id) {
          const fetchAvatar = async () => {
            try {
              const response = await getUserAvatarByIdApi(auth.user.id);
              if (response && response.avatar_url) {
                setAvatar(response.avatar_url);
                setAuth((prevAuth) => ({
                  ...prevAuth,
                  user: { ...prevAuth.user, avatar_url: response.avatar_url },
                }));
              }
            } catch (error) {
              console.error("Error fetching avatar:", error);
            }
          };
          fetchAvatar();
        }
      }, [auth?.user?.id, auth?.user?.avatar_url]);
    
      if (appLoading) {
        return <p>Loading user data...</p>;
      }
    
      if (!auth.isAuthenticated) {
        return <p>User not logged in.</p>;
      }
    
      const userData = auth.user;
    
      const handleAvatarClick = () => {
        fileInputRef.current.click();
      };
    
      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        setLoading(true);
    
        try {
          let response;
          if (!userData.avatar_url) {
            response = await uploadUserAvatarApi(userData.id, file);
          } else {
            response = await updateUserAvatarApi(userData.id, file);
          }
    
          if (!response || !response.user || !response.user.avatar_url) {
            throw new Error("Avatar URL not found in API response");
          }
    
          const avatarUrl = response.user.avatar_url;
          setAvatar(avatarUrl);
    
          setAuth((prevAuth) => ({
            ...prevAuth,
            user: { ...prevAuth.user, avatar_url: avatarUrl },
          }));
        } catch (error) {
          console.error("Error uploading avatar:", error);
        } finally {
          setLoading(false);
        }
      };
    
    const avatarUrl = avatar || userData.avatar_url || "../src/assets/images/default-avatar.jpg";

    return (
        <div className="flex flex-col p-4 bg-[#ffffff] rounded-lg shadow-md">
          <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
              <div className="relative flex h-20 w-20 shrink-0">
                <img
                  alt="Avatar"
                  className={`${loading ? 'opacity-50' : 'opacity-100'} h-20 w-20 rounded-lg object-cover cursor-pointer`}
                  src={`${avatarUrl}?t=${new Date().getTime()}`}
                  onClick={handleAvatarClick}
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="break-all text-base font-semibold">
                    <h2 className="userName">{userData?.full_name ?? "null"}</h2>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-xs">
                    <p>{userData.full_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 mt-4 h-px w-full border-b"></div>
          <div className="space-y-2">
            <MenuItem text="Thông tin cá nhân" onClick={() => setSelectedTab("Thông tin cá nhân")} />
            <MenuItem text="Nhiệm vụ" onClick={() => setSelectedTab("Nhiệm vụ")} />
            <MenuItem text="Lịch sử giao dịch" onClick={() => setSelectedTab("Lịch sử giao dịch")} />
          </div>
        </div>
      );
}

export default ProfileCard;