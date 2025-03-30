import { useState, useEffect } from "react";
import { getUserApi, updateUserApi } from "../../utils/api.js";
import { notification } from "antd";
import "../../styles/components/PersonalInformation.css";

function PersonalInfoForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        if (response.data) setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        notification.error({ message: "Không thể tải thông tin người dùng" });
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
  
    setLoading(true);
    try {
      const response = await updateUserApi(user.id, user);
      console.log("Dữ liệu từ updateUserApi:", response.data); // Kiểm tra dữ liệu phản hồi
  
      if (response.data) {
        setUser((prevUser) => ({ ...prevUser, ...response.data })); // Cập nhật state đúng cách
      }
  
      notification.success({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      notification.error({ message: "Cập nhật thất bại!" });
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) return <p className="text-gray-500">Đang tải...</p>;

  return (
    <div className="p-4 border bg-white rounded-lg shadow-md">
      <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleUpdate}>
        {[
          { id: "username", label: "Tên người dùng" },
          { id: "email", label: "Email" },
          { id: "full_name", label: "Họ và Tên" },
          { id: "address", label: "Địa chỉ" },
          { id: "phone_number", label: "Số điện thoại" },
        ].map(({ id, label }) => (
          <div key={id} className="input-field">
            <input
              required
              type="text"
              name={id}
              id={id}
              value={user[id] || ""}
              onChange={handleChange}
            />
            <label htmlFor={id}>{label}</label>
          </div>
        ))}

        <button type="submit" className="btn-submit" disabled={loading}>
          <span>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
          </span>
        </button>
      </form>
    </div>
  );
}

export default PersonalInfoForm;
