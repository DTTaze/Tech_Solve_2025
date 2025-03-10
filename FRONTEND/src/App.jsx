import Header from "./components/layout/header";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
