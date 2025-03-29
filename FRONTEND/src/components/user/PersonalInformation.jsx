import { useState, useEffect } from "react";
import { getUserApi, updateUserApi } from "../../utils/api.js";
import { notification } from "antd";

function PersonalInfoForm() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    full_name: "",
    address: "",
    phone_number: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        setUser(response.data || {}); // Đảm bảo không bị undefined
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        notification.error({ message: "Không thể tải thông tin người dùng" });
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserApi(user.id, user);
      notification.success({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      notification.error({ message: "Cập nhật thất bại!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
      <hr className="my-2 border-gray-300" />
      {user ? (
        <form className="space-y-4" onSubmit={handleUpdate}>
          <FormGroup label="Họ và Tên" required>
            <input
              type="text"
              className="form-input"
              value={user.full_name}
              onChange={(e) => setUser({ ...user, full_name: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Địa chỉ" required>
            <input
              type="text"
              className="form-input"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              required
            />
          </FormGroup>
          <FormGroup label="Số điện thoại">
            <span>{user.phone_number || "Chưa có số điện thoại"}</span>
          </FormGroup>
          <FormGroup label="Tên đăng nhập">
            <span>{user.username || "Chưa có tên đăng nhập"}</span>
          </FormGroup>
          <FormGroup label="Email">
            <span>{user.email || "Chưa có email"}</span>
          </FormGroup>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </form>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
}

function FormGroup({ label, children, required }) {
  return (
    <div className="flex flex-col">
      <label className="font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default PersonalInfoForm;
