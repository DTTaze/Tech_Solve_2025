import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../layouts/auth.context";
import {
  uploadUserAvatarApi,
  updateUserAvatarApi,
  getUserAvatarByIdApi,
} from "../utils/api.js";
import "./user-profile.css";

function UserProfile() {
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

      // Update auth context with new avatar URL
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

  const avatarUrl =
    avatar || userData.avatar_url || "/assets/photos/default-avatar.jpg";

  return (
    <div>
      <div className="userProfile">
        <div className="userInfomation_1">
          <div className="userInfomation_1--container">
            <img
              alt="user-image"
              className="userImage"
              src={`${avatarUrl}?t=${new Date().getTime()}`}
              onClick={handleAvatarClick}
              style={{ cursor: "pointer", opacity: loading ? 0.5 : 1 }}
            />
            {loading && <p>Uploading...</p>}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div>
              <h2 className="userName">{userData?.full_name ?? "null"}</h2>
              {/* <p className="status">{userData?.status ?? "null"}</p> */}
            </div>
          </div>
          <div className="userInfomation_1--buttons">
            <button>Chỉnh sửa hồ sơ</button>
          </div>
        </div>

        <div className="userInformation_2">
          {/* <i className="fa-regular fa-circle-user"></i>
          <p>User ID</p>
          <p>{userData.id || "N/A"}</p> */}

          <i className="fa-regular fa-id-card"></i>
          <p>Username</p>
          <p>{userData.username}</p>

          <i className="fa-regular fa-envelope"></i>
          <p>Email</p>
          <p>{userData.email}</p>

          <i className="fa-regular fa-comment"></i>
          <p>Phone number</p>
          <p>{userData.phone || "N/A"}</p>
        </div>
        <div className="organizations">
          <header>
            <h2>Organizations</h2>
            <p className="subtext">View user's organization memberships</p>
          </header>

          <div className="organizations--container">
            <div className="organizations-card">
              <div className="org-info">
                <i className="fa-solid fa-globe org-icon"></i>
                <div className="org-details">
                  <p className="org-name">Acme, Ltd</p>
                  <p className="org-role">
                    {userData.role_id === 1
                      ? "Admin"
                      : userData.role_id === 2
                      ? "User"
                      : "Customer"}
                  </p>
                </div>
              </div>
              <div className="org-right">
                <p className="org-date">since 23 Jul, 2024</p>
                <button className="org-options">⋮</button>
              </div>
            </div>
            <hr />
            <button className="add-org-btn">+ Add to organization</button>
          </div>
        </div>

        <div className="contactInformation">
          <header>
            <h2>Contact information</h2>
            <p className="subtext">Manage user email, phone</p>
          </header>

          <div className="contactInformation--container">
            <h3>Email address</h3>
            <div className="email-list">
              <div className="email-item">
                <p>hi@company.dev ✅</p>
                <span>used 3 hours ago</span>
                <span>added 23 Jul, 2024</span>
                <button>...</button>
              </div>
              <div className="email-item">
                <p>
                  hello@personalemail.com{" "}
                  <span className="primary">Primary</span>
                </p>
                <span>used 2 months ago</span>
                <span>added 23 Jul, 2024</span>
                <button>...</button>
              </div>
            </div>
            <button className="add-btn">+ Add email</button>

            <h3>Phone numbers</h3>
            <div className="phone-list">
              <div className="phone-item">
                <p>(+44) 141 556-9988 ✅</p>
                <span>used never</span>
                <span>added 23 Jul, 2024</span>
                <button>...</button>
              </div>
            </div>
            <button className="add-btn">+ Add phone</button>
          </div>
        </div>

        <div className="socialAccounts">
          <header>
            <h2>Social Accounts</h2>
            <p className="subtext">Manage social accounts</p>
          </header>

          <div className="socialAccounts--container">
            <div className="accounts-list">
              <div className="accounts-item">
                <p>
                  Facebook <span>@charlie_r</span>
                </p>
                <span>used 14 days ago</span>
                <span>added 23 Jul, 2024</span>
                <button>...</button>
              </div>
            </div>
            <button className="add-btn">+ Add more</button>
          </div>
        </div>

        <div className="userActivity"></div>
      </div>
    </div>
  );
}

export default UserProfile;
