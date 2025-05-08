import { useState, useEffect } from "react";
import InputField from "../../ui/InputField.jsx"; 
import Button from "../../ui/Button.jsx"; 

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    type: "home",
  });
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const mockAddresses = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        phoneNumber: "0123456789",
        address: "123 Đường Láng, Hà Nội",
        type: "home",
      },
      {
        id: 2,
        fullName: "Trần Thị B",
        phoneNumber: "0987654321",
        address: "456 Nguyễn Trãi, TP.HCM",
        type: "office",
      },
    ];
    setAddresses(mockAddresses);
    setDefaultAddressId(1); 
  }, []);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value) error = "Họ và tên không được để trống";
        else if (!/^[a-zA-ZÀ-ỹà-ỹ\s]+$/.test(value))
          error = "Họ và tên không được chứa ký tự đặc biệt";
        break;
      case "phoneNumber":
        if (!value) error = "Số điện thoại không được để trống";
        else if (!/^\d{10}$/.test(value))
          error = "Số điện thoại phải là 10 chữ số";
        break;
      case "address":
        if (!value) error = "Địa chỉ không được để trống";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTypeChange = (e) => {
    setNewAddress((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleAddAddress = () => {
    const newErrors = {};
    ["fullName", "phoneNumber", "address"].forEach((field) => {
      const error = validateField(field, newAddress[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newAddressEntry = {
      id: addresses.length + 1,
      fullName: newAddress.fullName,
      phoneNumber: newAddress.phoneNumber,
      address: newAddress.address,
      type: newAddress.type,
    };

    setAddresses([...addresses, newAddressEntry]);
    setNewAddress({ fullName: "", phoneNumber: "", address: "", type: "home" });
    setErrors({});
    setIsModalOpen(false);
  };

  const handleUpdateAddress = (id) => {
    alert(`Cập nhật địa chỉ ID: ${id} (Chưa triển khai)`);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    if (defaultAddressId === id) {
      setDefaultAddressId(addresses[0]?.id || null);
    }
  };

  const handleSetDefault = (id) => {
    setDefaultAddressId(id);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">Địa chỉ của tôi</h4>
        <Button
          text="Thêm địa chỉ mới"
          onClick={() => setIsModalOpen(true)}
          padding="15px"
        />
      </div>
      <hr className="my-2 border-gray-300" />

      {/* Address List */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex justify-between items-start p-4 border rounded-lg ${
              defaultAddressId === addr.id ? "border-green-500 bg-green-50" : ""
            }`}
          >
            <div>
              <p className="font-semibold">{addr.fullName}</p>
              <p className="text-gray-600">{addr.phoneNumber}</p>
              <p className="text-gray-600">{addr.address}</p>
              <p className="text-sm text-gray-500">{addr.type === "home" ? "Nhà riêng" : "Văn phòng"}</p>
              {defaultAddressId === addr.id && (
                <p className="text-sm text-green-600 font-semibold">Mặc định</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                text="Cập nhật"
                onClick={() => handleUpdateAddress(addr.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                padding="10px"
              />
              <Button
                text="Xóa"
                onClick={() => handleDeleteAddress(addr.id)}
                padding="10px"
              />
              {defaultAddressId !== addr.id && (
                <Button
                  text="Thiết lập mặc định"
                  onClick={() => handleSetDefault(addr.id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white text-sm"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding New Address */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h4 className="font-semibold text-lg mb-4">Thêm địa chỉ mới</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InputField
                id="fullName"
                label="Họ và tên"
                name="fullName"
                value={newAddress.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
              />
              <InputField
                id="phoneNumber"
                label="Số điện thoại"
                name="phoneNumber"
                value={newAddress.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
              />
            </div>
            <div className="mb-4">
              <InputField
                id="address"
                label="Địa chỉ"
                name="address"
                value={newAddress.address}
                onChange={handleInputChange}
                error={errors.address}
              />
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Loại địa chỉ</p>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="home"
                    checked={newAddress.type === "home"}
                    onChange={handleTypeChange}
                    className="mr-2"
                  />
                  Nhà riêng
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="office"
                    checked={newAddress.type === "office"}
                    onChange={handleTypeChange}
                    className="mr-2"
                  />
                  Văn phòng
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                text="Trở lại"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              />
              <Button
                text="Hoàn thành"
                onClick={handleAddAddress}
                className="bg-green-500 hover:bg-green-600 text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Address;