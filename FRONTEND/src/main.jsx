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
import AuthCallback from "./pages/AuthCallback.jsx";
import "./index.css";
import { NotificationProvider } from "./components/ui/NotificationProvider";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import UsersManagement from "./components/admin/UsersManagement.jsx";
import ContentManagement from "./components/admin/ContentManagement.jsx";
import RolesPermissions from "./components/admin/RolesPermissions.jsx";
import MissionsManagement from "./components/admin/MissionsManagement.jsx";
import ItemsManagement from "./components/admin/ItemsManagement.jsx";
import TransactionsManagement from "./components/admin/TransactionsManagement.jsx";
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
      // {
      //   path: "mission-video",
      //   element: <MissionVideo />,
      // },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="Admin">
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <UsersManagement /> },

          {
            path: "content",
            element: <ContentManagement />,
            children: [
              { path: "missions", element: <MissionsManagement /> },
              { path: "items", element: <ItemsManagement /> },
            ],
          },
          { path: "rbac", element: <RolesPermissions /> },
          { path: "transactions", element: <TransactionsManagement /> },
          // { path: "rewards", element: <RewardManagement /> },
        ],
      },
      {
        path: "auth/success",
        element: <AuthCallback />,
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
