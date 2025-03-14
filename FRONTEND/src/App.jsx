import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./components/layout/auth.context";
import axios from "./utils/axios.customize";
import { Spin } from "antd";
function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);
  useEffect(() => {
    const fetchAccount = async () => {
      setAppLoading(true);
      const res = await axios.get("/account");
      if (res && !res.message) {
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.email,
            username: res.username,
          },
        });
      }
      setAppLoading(false);
    };
    fetchAccount();
  }, []);
  return (
    <div>
      {appLoading === true ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;
