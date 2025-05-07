import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import ProfileCard from "../components/features/user/ProfileCard.jsx";
import PersonalInfoForm from "../components/features/user/PersonalInformation.jsx";
import MissionCompleted from "../components/features/user/MissionCompleted.jsx";
import PurchaseOrder from "../components/features/user/PurchaseOrder.jsx";
import ProfileCardSkeleton from "../components/features/user/ProfileCardSkeleton.jsx";
import PersonalInfoFormSkeleton from "../components/features/user/PersonalnfomationSkeleton.jsx";

function UserProfile() {
  const { auth } = useContext(AuthContext); 
  const [selectedTab, setSelectedTab] = useState("Thông tin cá nhân");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [auth]);

  const renderContent = () => {
    switch (selectedTab) {
      case "Thông tin cá nhân":
        return isLoading ? <PersonalInfoFormSkeleton /> : <PersonalInfoForm />;
      case "Nhiệm vụ hoàn thành":
        return <MissionCompleted />;
      case "Đơn mua":
        return <PurchaseOrder />; 
      default:
        return isLoading ? <PersonalInfoFormSkeleton /> : <PersonalInfoForm />;
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#f7f8fa]">
      <div className="w-[80vw] m-auto flex gap-3">
        <div className="w-[30%] mt-4">
          {isLoading ? (
            <ProfileCardSkeleton />
          ) : (
            <ProfileCard setSelectedTab={setSelectedTab} />
          )}
        </div>
        <div className="w-[70%] mt-4">{renderContent()}</div>
      </div>
    </div>
  );
}

export default UserProfile;