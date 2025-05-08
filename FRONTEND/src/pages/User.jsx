import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../contexts/auth.context";
import { Outlet } from "react-router-dom";
import ProfileCard from "../components/features/user/ProfileCard.jsx";
import ProfileCardSkeleton from "../components/features/user/ProfileCardSkeleton.jsx";

function User() {
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [auth]);

  return (
    <div className="w-screen min-h-screen bg-[#f7f8fa]">
      <div className="w-[80vw] m-auto flex gap-3">
        <div className="w-[30%] mt-4">
          {isLoading ? <ProfileCardSkeleton /> : <ProfileCard />}
        </div>
        <div className="w-[70%] mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default User;