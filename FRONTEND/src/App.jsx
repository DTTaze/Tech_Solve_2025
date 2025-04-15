import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/auth.context";
import UserHeader from "./layouts/Header";
import { getUserApi } from "./utils/api";
import Loader from './components/ui/Loader';  

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
          <Loader /> 
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
};

export default App;
