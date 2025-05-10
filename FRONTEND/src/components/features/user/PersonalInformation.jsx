import { useState, useEffect, useContext } from "react";
import { updateUserPublicApi } from "../../../utils/api.js";
import { AuthContext } from "../../../contexts/auth.context.jsx";
import InputField from "../../ui/InputField.jsx";
import Button from "../../ui/Button.jsx";
import PersonalInfomationSkeleton from "./PersonalInfomationSkeleton.jsx";

function PersonalInformation() {
  const { auth, setAuth } = useContext(AuthContext); 
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setUser({
        public_id: auth.user.public_id,
        username: auth.user.username || "",
        email: auth.user.email || "",
        full_name: auth.user.full_name || "",
        phone_number: auth.user.phone_number || "",
      });
      setOriginalUser(auth.user);
    }
  }, [auth.user]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value) error = "Tên người dùng không được để trống";
        else if (value.length < 3)
          error = "Tên người dùng phải dài hơn 3 ký tự";
        else if (!/^[a-zA-Z0-9]+$/.test(value))
          error = "Tên người dùng chỉ được chứa chữ cái và số";
        break;
      case "email":
        if (!value) error = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email không hợp lệ";
        break;
      case "full_name":
        if (!value) error = "Họ và tên không được để trống";
        else if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value))
          error = "Họ và tên không được chứa ký tự đặc biệt";
        break;
      case "phone_number":
        if (!value) error = "Số điện thoại không được để trống";
        else if (!/^\d{10}$/.test(value))
          error = "Số điện thoại phải là 10 chữ số";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    const newErrors = {};
    inputFields.forEach(({ id }) => {
      const error = validateField(id, user[id] || "");
      if (error) newErrors[id] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      const payload = {
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
      };
      const res = await updateUserPublicApi(user.public_id, payload);
      setAuth((prev) => ({
        ...prev,
        user: res.data,
      }));
      setOriginalUser(res.data);
      setUser({
        public_id: res.data.public_id,
        username: res.data.username || "",
        email: res.data.email || "",
        full_name: res.data.full_name || "",
        phone_number: res.data.phone_number || "",
      });
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUser({
      public_id: originalUser.public_id,
      username: originalUser.username || "",
      email: originalUser.email || "",
      full_name: originalUser.full_name || "",
      phone_number: originalUser.phone_number || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  if (!auth.isAuthenticated || !user) return <PersonalInfomationSkeleton />;

  const inputFields = [
    { id: "username", label: "Tên người dùng" },
    { id: "email", label: "Email" },
    { id: "full_name", label: "Họ và Tên" },
    { id: "phone_number", label: "Số điện thoại" },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
        {!isEditing && (
          <Button
            text="Chỉnh sửa hồ sơ"
            onClick={handleEdit}
            padding="15px"
          />
        )}
      </div>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleUpdate}>
        <div className="grid grid-cols-2 gap-4">
          {inputFields.map(({ id, label }) => (
            <div key={id}>
              <InputField
                id={id}
                label={label}
                value={user[id] || ""}
                onChange={handleChange}
                error={errors[id]}
                disabled={!isEditing}
                className={isEditing ? "" : "bg-gray-100 cursor-not-allowed"}
              />
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button
              text="Lưu"
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              padding="15px"
            />
            <Button
              text="Hủy"
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
              padding="15px"
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonalInformation;