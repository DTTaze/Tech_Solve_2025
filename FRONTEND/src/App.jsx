import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import UserHeader from "./layouts/Header";
import { getUserApi } from "./utils/api";

function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
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
        }
      } catch (err) {
        console.log(err);
      } finally {
        setAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  return (
    <div>
      {appLoading ? (
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
        </div>
      ) : (
        <>
          <UserHeader />
          <Outlet />
        </>
      )}
    </div>
  );
}

const styles = {
  spinnerWrapper: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ccc",
    borderTop: "4px solid #1890ff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Spinner animation style (injecting into the document head)
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default App;
