import { useState, useEffect, useCallback } from "react";
import { getUserApi, updateUserApi } from "../../utils/api.js";
import { notification } from "antd";
import "../../styles/components/PersonalInformation.css";

function PersonalInfoForm() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getUserApi({ params: { t: Date.now() } });
      console.log("Dữ liệu từ server:", response.data);
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      notification.error({ message: "Không thể tải thông tin người dùng" });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      console.log("Dữ liệu gửi đi:", user);
      const res = await updateUserApi(user.id, user);
      console.log("Phản hồi từ updateUserApi:", res.data);
      await fetchUser(); // Lấy lại dữ liệu mới
      notification.success({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      notification.error({ message: "Cập nhật thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-gray-500">Đang tải...</p>;

  const inputFields = [
    { id: "username", label: "Tên người dùng" },
    { id: "email", label: "Email" },
    { id: "full_name", label: "Họ và Tên" },
    { id: "address", label: "Địa chỉ" },
    { id: "phone_number", label: "Số điện thoại" },
  ];

  return (
    <div className="p-4 border bg-white rounded-lg shadow-md">
      <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleUpdate}>
        {inputFields.map(({ id, label }) => (
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

        <button type="submit" className="btn-submit" disabled={loading || !user}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </button>
      </form>
    </div>
  );
}

export default PersonalInfoForm;