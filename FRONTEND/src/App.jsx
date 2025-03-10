import Header from "../components/layout/header";
// import axios from "./utils/axios.customize";
// import { useEffect } from "react";
import { Outlet } from "react-router-dom";
function App() {
  // useEffect(() => {
  //   const fetchHelloWorld = async () => {
  //     const res = await axios.get(`/`);
  //     console.log(res);
  //   };
  //   fetchHelloWorld();
  // }, []);

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
