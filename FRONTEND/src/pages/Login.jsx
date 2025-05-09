import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../components/ui/NotificationProvider";
import { AuthContext } from "../contexts/auth.context";
import { loginUserApi } from "../utils/api";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import SocialLoginIcons from "../components/ui/SocialLoginIcons";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { notify } = useNotification();
  const [identifier, setIdentifier] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoginDisabled, setIsLoginDisabled] = useState(false);

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
      if (res && res.status === 200) {
        notify("success", "Đăng nhập thành công!");
        setAuth({
          isAuthenticated: true,
          user: res.data.user,
        });
        if (res.data.user.role_id === 1) {
          navigate("/admin");
        } else if (res.data.user.role_id === 2) {
          navigate("/");
        } else if (res.data.user.role_id === 3) {
          navigate("/customer");
        } else {
          notify("error", "Đã xảy ra lỗi, vui lòng thử lại sau");
        }
      } else {
        notify("error", res.error || "Đăng nhập thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      if (error.status === 401) {
        notify("error", "Thông tin đăng nhập không đúng");
      } else if (error.status === 429) {
        notify("error", "Quá nhiều yêu cầu, vui lòng thử lại sau 5 phút");
        setIsLoginDisabled(true);
        setTimeout(() => {
          setIsLoginDisabled(false);
          notify("info", "Bạn có thể thử đăng nhập lại bây giờ");
        }, 300000);
      } else {
        notify("error", error.message || "Đã xảy ra lỗi, vui lòng thử lại.");
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

        {/* Nút đăng nhập sẽ bị vô hiệu hóa khi isLoginDisabled = true */}
        <Button
          text="Đăng nhập"
          disabled={isLoginDisabled}
          width="100%"
          padding="15px"
        />

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
