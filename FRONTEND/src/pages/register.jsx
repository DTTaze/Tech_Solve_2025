import React, { useState } from "react";
import { createUserApi } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/ui/InputField";

function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "full_name":
        if (!value.trim()) error = "Vui lòng nhập họ tên!";
        break;
      case "username":
        if (!value.trim()) error = "Vui lòng nhập tên tài khoản!";
        break;
      case "email":
        if (!value.trim()) error = "Vui lòng nhập email!";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ!";
        break;
      case "password":
        if (!value) error = "Vui lòng nhập mật khẩu!";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await createUserApi(formData);
      if (res && res.status === 200) {
        alert("Đăng ký thành công!");
        navigate("/login");
      } else {
        alert(res.error || "Đăng ký không thành công. Vui lòng thử lại!");
      }
    } catch (e) {
      alert(e.message || "Đăng ký không thành công. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 border rounded-md shadow">
      <h4 className="text-xl font-semibold mb-4">Đăng ký tài khoản</h4>
      <hr className="my-2 border-gray-300" />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="full_name"
          label="Họ tên"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
        />
        <InputField
          id="username"
          label="Tên tài khoản"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />
        <InputField
          id="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <InputField
          id="password"
          label="Mật khẩu"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-submit w-full py-2 text-white text-lg"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      <hr className="my-4" />
      <p className="text-center">
        Đã có tài khoản?{" "}
        <Link to="/login" className="text-blue-600 font-medium">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
