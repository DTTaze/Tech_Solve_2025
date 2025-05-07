import { useState, useEffect, useCallback } from "react";
import { getUserApi, updateUserPublicApi } from "../../../utils/api.js";
import InputField from "../../ui/InputField.jsx";
import Button from "../../ui/Button.jsx";
import PersonalInfomationSkeleton from "./PersonalInfomationSkeleton.jsx";

function PersonalInformation() {
  const [user, setUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getUserApi({ params: { t: Date.now() } });
      if (response.data) {
        setUser(response.data);
        setOriginalUser(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      alert("Không thể tải thông tin người dùng");
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
      case "address":
        if (!value) error = "Địa chỉ không được để trống";
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
      const res = await updateUserPublicApi(user.public_id, user);
      await fetchUser();
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
    setUser(originalUser);
    setErrors({});
    setIsEditing(false);
  };

  if (!user) return <PersonalInfomationSkeleton />;

  const inputFields = [
    { id: "username", label: "Tên người dùng" },
    { id: "email", label: "Email" },
    { id: "full_name", label: "Họ và Tên" },
    { id: "address", label: "Địa chỉ" },
    { id: "phone_number", label: "Số điện thoại" },
  ];

  return (
    <div className="p-4 border bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">Thông tin cá nhân</h4>
        {!isEditing && (
          <Button
            text="Chỉnh sửa hồ sơ"
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          />
        )}
      </div>
      <hr className="my-2 border-gray-300" />

      <form className="space-y-4" onSubmit={handleUpdate}>
        <div className="grid grid-cols-3 gap-4">
          {inputFields.map(({ id, label }) => (
            <div key={id} >
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
          <div className="flex space-x-2">
            <Button
              text="Lưu"
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
            />
            <Button
              text="Hủy"
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            />
          </div>
        )}
      </form>
    </div>
  );
}

export default PersonalInformation;