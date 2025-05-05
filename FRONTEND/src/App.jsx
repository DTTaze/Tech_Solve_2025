import { useState, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import UserHeader from "./layouts/Header";
import { getUserApi } from "./utils/api";
import Loader from "./components/ui/Loader";
import { io } from "socket.io-client";
import { SocketProvider } from "./contexts/socket.context";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true, 
});

function App() {
  const { setAuth } = useContext(AuthContext);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await getUserApi(); 
        if (res && res.status === 200) {
          setAuth({
            isAuthenticated: true,
            user: res.data,
          });
        } else {
          setAuth({ isAuthenticated: false, user: null });
        }
      } catch (err) {
        setAuth({ isAuthenticated: false, user: null });
      } finally {
        setAppLoading(false);
      }
    };

    initializeAuth();
  }, [setAuth]);

  return (
    <SocketProvider value={socket}>
      <div>
        {appLoading ? (
          <div style={styles.spinnerWrapper}>
            <Loader />
          </div>
        ) : (
          <>
            <UserHeader />
            <Outlet />
          </>
        )}
      </div>
    </SocketProvider>
  );
}

const styles = {
  spinnerWrapper: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

export default App;