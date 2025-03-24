import { useState, useEffect } from "react";
import { getUserApi } from "../../utils/api.js";

function PersonalInfoForm() {
  const [user, setUser] = useState({
    full_name: "",
    address: "",
    phone: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    getUserApi()
      .then((response) => setUser(response))
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-6">
      <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
      <hr className="my-2 border-gray-300" />
      <form className="space-y-4">
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
          <span>{user.phone || "Chưa có số điện thoại"}</span>
        </FormGroup>
        <FormGroup label="Tên đăng nhập">
          <span>{user.username || "Chưa có tên đăng nhập"}</span>
        </FormGroup>
        <FormGroup label="Email">
          <span>{user.email || "Chưa có email"}</span>
        </FormGroup>
        <button type="submit" className="btn btn-primary">
          Cập nhật
        </button>
      </form>
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
