import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUserApi } from "../utils/api";
import { AuthContext } from "../contexts/auth.context";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!identifier.trim()) newErrors.identifier = "Vui lòng nhập email hoặc username.";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(identifier);
      const loginData = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await loginUserApi(loginData);

      if (res && res.status === 200) {
        localStorage.setItem("access_token", res.data.access_token);
        alert("Đăng nhập thành công!");

        setAuth({
          isAuthenticated: true,
          user: {
            email: res.data.user?.email ?? "",
            username: res.data.user?.username ?? "",
          },
        });

        navigate("/");
      } else {
        alert(res.error || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      alert(error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 border border-gray-300 rounded shadow bg-white">
      <h2 className="text-xl font-semibold text-center mb-4">Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="identifier"
          label="Email hoặc Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
        />

        <InputField
          id="password"
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Button text="Đăng nhập"></Button>
      </form>

      <hr className="my-6 border-gray-300" />

      <div className="text-center">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Đăng ký tại đây
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
