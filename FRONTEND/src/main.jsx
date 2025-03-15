import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import { AuthWrapper } from "./components/layout/auth.context.jsx";
import HomePage from "./pages/homepage.jsx";
import MissionPage from "./pages/mission.jsx"; 
import UserPage from "./pages/user.jsx";
import LoginPage from "./pages/login.jsx";
import RegisterPage from "./pages/register.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // {
      //   index: true,
      //   element: <HomePage />,
      // },
      {
        index: true,
        element: <Mission/>,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "missions",
        element: <MissionPage />,
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
      <RouterProvider router={router} />
    </AuthWrapper>
  </StrictMode>
);
