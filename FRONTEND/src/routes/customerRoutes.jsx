import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import CustomerProfile from "../components/customer/CustomerProfile";
import CustomerOrders from "../components/customer/CustomerOrders";
import CustomerRewards from "../components/customer/CustomerRewards";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/orders" element={<CustomerOrders />} />
      <Route path="/rewards" element={<CustomerRewards />} />
    </Routes>
  );
}
