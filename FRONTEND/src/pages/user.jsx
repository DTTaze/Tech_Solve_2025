import { useState } from "react";
import UserHeader from "../layouts/Header.jsx";
import ProfileCard from '../components/user/ProfileCard.jsx';
import PersonalInfoForm from "../components/user/PersonalInformation.jsx";
import UserDashboard from "../components/user/UserDashboard.jsx";
import TransactionHistory from "../components/user/TransactionHistory.jsx";

function UserProfile() {
  const [selectedTab, setSelectedTab] = useState("Thông tin cá nhân");

  const renderContent = () => {
    switch (selectedTab) {
      case "Thông tin cá nhân":
        return <PersonalInfoForm />;
      case "Nhiệm vụ":
        return <UserDashboard />;
      case "Lịch sử giao dịch":
        return <TransactionHistory />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <>
      <UserHeader />
      <div className="w-screen min-h-screen bg-[#f7f8fa] mt-18">
        <div className="w-[80vw] m-auto flex gap-3">
          <div className="grow-1 mt-4">
            <ProfileCard setSelectedTab={setSelectedTab} />
          </div>
          <div className="grow-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
