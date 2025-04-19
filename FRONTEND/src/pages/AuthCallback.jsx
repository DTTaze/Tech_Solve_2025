import { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import { getUserApi } from "../utils/api";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      const fetchUser = async () => {
        try {
          const res = await getUserApi();
          if (res && res.status === 200) {
            setAuth({
              isAuthenticated: true,
              user: res.data,
            });
            if (res.data.avatar_url) {
              localStorage.setItem("user_avatar_url", res.data.avatar_url);
            }
            navigate("/", { replace: true });
          } else {
            alert("Login failed!");
            navigate("/login");
          }
        } catch (err) {
          console.error("Failed to fetch user info after login:", err);
          alert("Login failed!");
          navigate("/login");
        }
      };

      fetchUser();
    } else {
      alert("Login failed!");
      navigate("/login");
    }

    handled.current = true;
  }, [navigate, setAuth]);

  return <div>Loading...</div>;
};

export default AuthCallback;
