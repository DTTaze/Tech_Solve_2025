import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthWrapper } from "./contexts/auth.context.jsx";
import Homepage from "./pages/Homepage.jsx";
import MissionPage from "./pages/Mission.jsx";
import UserProfilePage from "./pages/User.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import MarketPage from "./pages/ExchangeMarket.jsx";
import Admin from "./pages/Admin.jsx";
import MissionVideo from "./pages/MissionVideo.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import App from "./App.jsx";
import "./index.css";
import { NotificationProvider } from './components/ui/NotificationProvider';

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
        path: "mission-video",
        element: <MissionVideo />,
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="Admin">
            <Admin />
          </ProtectedRoute>
        ),
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
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthWrapper>
      <NotificationProvider>
      <RouterProvider router={router} />
      </NotificationProvider>
    </AuthWrapper>
  </StrictMode>
);
