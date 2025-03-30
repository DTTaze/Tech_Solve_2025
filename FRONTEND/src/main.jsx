import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import Homepage from "./pages/homepage.jsx";
import MissionPage from "./pages/mission.jsx";
import UserProfilePage from "./pages/User.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";
import MarketPage from "./pages/ExchangeMarket.jsx";
import Admin from "./pages/admin.jsx";
import MissionVideo from "./pages/MissionVideo.jsx"
import App from "./App.jsx";
import "./index.css"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "missions",
        element: <MissionPage />,
      },
      {
        path: "market",
        element: <MarketPage />,
      },
      {
        path: "videos",
        element: <MissionVideo />,
      },
    ],
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "admin",
    element: <Admin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper> 
  </StrictMode>
);
