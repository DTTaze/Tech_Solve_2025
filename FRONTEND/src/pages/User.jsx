import { useState } from "react";
import ProfileCard from "../components/features/user/ProfileCard.jsx";
import PersonalInfoForm from "../components/features/user/PersonalInformation.jsx";
import CompletedTaskList from "../components/features/user/CompletedTasksList.jsx";
import TransactionHistory from "../components/features/user/TransactionHistory.jsx";

function UserProfile() {
  const [selectedTab, setSelectedTab] = useState("Thông tin cá nhân");

  const renderContent = () => {
    switch (selectedTab) {
      case "Thông tin cá nhân":
        return <PersonalInfoForm />;
      case "Nhiệm vụ":
        return <CompletedTaskList />;
      case "Lịch sử giao dịch":
        return <TransactionHistory />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <>
      <div className="w-screen min-h-screen bg-[#f7f8fa]">
        <div className="w-[80vw] m-auto flex gap-3">
          <div className="w-[30%] mt-4">
            <ProfileCard setSelectedTab={setSelectedTab} />
          </div>
          <div className="w-[70%] mt-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
