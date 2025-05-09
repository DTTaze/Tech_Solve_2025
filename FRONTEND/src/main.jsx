import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/auth.context.jsx";
import { NotificationProvider } from "./components/ui/NotificationProvider";
import AuthCallback from "./pages/AuthCallback.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Homepage from "./pages/Homepage.jsx";
import MissionPage from "./pages/Mission.jsx";
import ExchangeMarket from "./pages/ExchangeMarket.jsx";
import ItemCatalog from "./components/features/exchangemarket/ItemCatalog.jsx";
import User from "./pages/User.jsx";
import PersonalInformation from "./components/features/user/PersonalInformation.jsx";
import Address from "./components/features/user/Address.jsx";
import PurchaseOrder from "./components/features/user/PurchaseOrder.jsx";
import ChangePassword from "./components/features/user/ChangePassword.jsx";
import DeleteAccount from "./components/features/user/DeleteAccount.jsx";
import MissionCompleted from "./components/features/user/MissionCompleted.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import UsersManagement from "./components/admin/UsersManagement.jsx";
import ContentManagement from "./components/admin/ContentManagement.jsx";
import RolesPermissions from "./components/admin/RolesPermissions.jsx";
import MissionsManagement from "./components/admin/MissionsManagement.jsx";
import ItemsManagement from "./components/admin/ItemsManagement.jsx";
import TransactionsManagement from "./components/admin/TransactionsManagement.jsx";
import Customer from "./pages/Customer.jsx";
import CustomerDashboard from "./components/customer/CustomerDashboard.jsx";
import CustomerProfile from "./components/customer/CustomerProfile.jsx";
import CustomerOrders from "./components/customer/CustomerOrders.jsx";
import CustomerRewards from "./components/customer/CustomerRewards.jsx";
import AdminQueue from "./pages/AdminQueue.jsx";
import ProductsManagement from "./components/admin/ProductsManagement.jsx";
import CustomerQRScanner from "./components/customer/CustomerQRScanner/CustomerQRScanner.jsx";
import CustomerUsers from "./components/customer/CustomerUsers.jsx";
import CustomerItems from "./components/customer/CustomerItems/index.jsx";
import CustomerEvents from "./components/customer/CustomerEvents/CustomerEvents.jsx";
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
        path: "missions",
        element:
          <MissionPage />
      },
      {
        path: "exchange-market",
        element: <ExchangeMarket />,
        children: [
          { path: "redeem", element: <ItemCatalog view="redeem" /> },
          { path: "my-items", element: <ItemCatalog view="my_items" /> },
          { path: "all-items", element: <ItemCatalog view="all_items" /> },
          { index: true, element: <Navigate to="redeem" replace /> },
        ],
      },
      {
        path: "forgot_password",
        element: <ForgotPassword />,
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <User />,
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <PersonalInformation /> },
          { path: "account", element: <PersonalInformation /> },
          { path: "address", element: <Address /> },
          { path: "purchase", element: <PurchaseOrder /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "delete-account", element: <DeleteAccount /> },
          { path: "missions", element: <MissionCompleted /> },
        ],
      },
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
              { path: "products", element: <ProductsManagement /> },
              { path: "events", element: <ProductsManagement /> },
            ],
          },
          { path: "rbac", element: <RolesPermissions /> },
          { path: "transactions", element: <TransactionsManagement /> },
          {
            path: "queues",
            element: <AdminQueue />,
          },
        ],
      },
      {
        path: "auth/success",
        element: <AuthCallback />,
      },
      {
        path: "customer",
        element: (
          <ProtectedRoute requiredRole={["Customer", "Admin"]}>
            <Customer />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <CustomerDashboard /> },
          { path: "profile", element: <CustomerProfile /> },
          { path: "orders", element: <CustomerOrders /> },
          { path: "rewards", element: <CustomerRewards /> },
          { path: "scanner", element: <CustomerQRScanner /> },
          { path: "users", element: <CustomerUsers /> },
          { path: "items", element: <CustomerItems /> },
          { path: "events", element: <CustomerEvents /> },
        ],
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
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
