import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthWrapper } from "./layouts/auth.context.jsx";
import Homepage from "./pages/Homepage.jsx";
import MissionPage from "./pages/Mission.jsx";
import UserProfilePage from "./pages/User.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import MarketPage from "./pages/ExchangeMarket.jsx";
import Admin from "./pages/Admin.jsx";

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
