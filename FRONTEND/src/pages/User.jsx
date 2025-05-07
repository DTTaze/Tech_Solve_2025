import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/auth.context";
import ProfileCard from "../components/features/user/ProfileCard.jsx";
import PersonalInformation from "../components/features/user/PersonalInformation.jsx";
import Address from "../components/features/user/Address.jsx";
import MissionCompleted from "../components/features/user/MissionCompleted.jsx";
import PurchaseOrder from "../components/features/user/PurchaseOrder.jsx";
import ProfileCardSkeleton from "../components/features/user/ProfileCardSkeleton.jsx";
import PersonalInfoFormSkeleton from "../components/features/user/PersonalInfomationSkeleton.jsx";

// Placeholder components for submenu items
function ChangePassword() {
  return <div className="p-4 bg-white rounded-lg shadow-md">Đổi mật khẩu (Chưa triển khai)</div>;
}

function UserProfile() {
  const { auth } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState("Xem hồ sơ");
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
      case "Xem hồ sơ":
        return isLoading ? <PersonalInfoFormSkeleton /> : <PersonalInformation />;
      case "Địa chỉ":
        return isLoading ? <PersonalInfoFormSkeleton /> : <Address />;
      case "Đổi mật khẩu":
        return <ChangePassword />;
      case "Xóa tài khoản":
        return <DeleteAccount />;
      case "Nhiệm vụ hoàn thành":
        return <MissionCompleted />;
      case "Đơn mua":
        return <PurchaseOrder />;
      default:
        return isLoading ? <PersonalInfoFormSkeleton /> : <PersonalInformation />;
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#f7f8fa]">
      <div className="w-[80vw] m-auto flex gap-3">
        <div className="w-[30%] mt-4">
          {isLoading ? (
            <PersonalInfoFormSkeleton />
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