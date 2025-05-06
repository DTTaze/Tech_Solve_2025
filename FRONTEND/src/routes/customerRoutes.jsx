import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import CustomerProfile from "../components/customer/CustomerProfile";
import CustomerOrders from "../components/customer/CustomerOrders";
import CustomerRewards from "../components/customer/CustomerRewards";
import CustomerEvents from "../components/customer/CustomerEvents";
import CustomerItems from "../components/customer/CustomerItems";
import CustomerUsers from "../components/customer/CustomerUsers";
import CustomerQRScanner from "../components/customer/CustomerQRScanner";

export default function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/profile" element={<CustomerProfile />} />
      <Route path="/orders" element={<CustomerOrders />} />
      <Route path="/rewards" element={<CustomerRewards />} />
      <Route path="/events" element={<CustomerEvents />} />
      <Route path="/items" element={<CustomerItems />} />
      <Route path="/users" element={<CustomerUsers />} />
      <Route path="/scanner" element={<CustomerQRScanner />} />
    </Routes>
  );
}
