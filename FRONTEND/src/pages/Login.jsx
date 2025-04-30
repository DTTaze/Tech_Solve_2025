import { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { loginUserApi } from "../utils/api";
import { AuthContext } from "../contexts/auth.context";
import { useNotification } from "../components/ui/NotificationProvider";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import SocialLoginIcons from "../components/ui/SocialLoginIcons";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { notify } = useNotification();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!identifier.trim())
      newErrors.identifier = "Vui lòng nhập email hoặc username.";
    if (!password) newErrors.password = "Vui lòng nhập mật khẩu.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
        identifier
      );
      const loginData = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await loginUserApi(loginData);
      console.log(res);
      if (res && res.status === 200) {
        notify("success", "Đăng nhập thành công!");

        setAuth({
          isAuthenticated: true,
          user: {
            email: res.data.user?.email ?? "",
            username: res.data.user?.username ?? "",
          },
        });
        navigate("/");
      } else {
        notify("error", res.error || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      if (error.status == 400) {
        notify("error", "Vui lòng kiểm tra lại Email và Username hoặc Mật khẩu");
      } else {
        notify("error", "error.message" || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-600 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        <Button text="Đăng nhập" />
        
        <div className="text-right">
          <Link to="/forgot_password" className="text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
      </form>

      <hr className="my-6 border-gray-300" />
      <SocialLoginIcons />
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