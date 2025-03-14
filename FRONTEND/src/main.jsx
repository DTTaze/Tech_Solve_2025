import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterPage from "./pages/register.jsx";
import UserPage from "./pages/user.jsx";
import App from "./App.jsx";
import LoginPage from "./pages/login.jsx";
import { AuthWrapper } from "./components/layout/auth.context.jsx";
import Mission from "../src/pages/mission.jsx";
import HomePage from "./pages/homepage.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
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
    <HomePage />
    {/* <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper> */}
  </StrictMode>
);
