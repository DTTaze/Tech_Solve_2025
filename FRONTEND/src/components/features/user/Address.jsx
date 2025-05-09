import { useState, useEffect } from "react";
import InputField from "../../ui/InputField.jsx";
import Button from "../../ui/Button.jsx";
import { getAllProvincesApi, getAllDistrictsByProvinceApi, getAllWardsByDistrictApi } from "../../../utils/api.js";

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    province: "", // Stores ProvinceID as integer
    district: "", // Stores DistrictID as integer
    ward: "",
    type: "home",
  });
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [token] = useState("c3f24415-29b9-11f0-9b81-222185cb68c8"); // Replace with actual token or auth mechanism
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const response = await getAllProvincesApi(token);
        if (response.code === 200) {
          setProvinces(response.data);
        } else {
          setErrorMessage("Failed to fetch provinces. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setErrorMessage("Error fetching provinces. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvinces();
  }, [token]);

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (newAddress.province && Number.isInteger(newAddress.province)) {
        setIsLoading(true);
        try {
          const response = await getAllDistrictsByProvinceApi(newAddress.province, token);
          if (response.code === 200) {
            setDistricts(response.data);
            setWards([]);
            setNewAddress((prev) => ({ ...prev, district: "", ward: "" }));
          } else {
            setErrorMessage("Failed to fetch districts. Please try again.");
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
          setErrorMessage("Error fetching districts. Please check your connection.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setDistricts([]);
        setWards([]);
        setNewAddress((prev) => ({ ...prev, district: "", ward: "" }));
      }
    };
    fetchDistricts();
  }, [newAddress.province, token]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (newAddress.district && Number.isInteger(newAddress.district)) {
        setIsLoading(true);
        try {
          const response = await getAllWardsByDistrictApi(newAddress.district, token);
          if (response.code === 200) {
            setWards(response.data);
            setNewAddress((prev) => ({ ...prev, ward: "" }));
          } else {
            setErrorMessage("Failed to fetch wards. Please try again.");
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
          setErrorMessage("Error fetching wards. Please check your connection.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setWards([]);
        setNewAddress((prev) => ({ ...prev, ward: "" }));
      }
    };
    fetchWards();
  }, [newAddress.district, token]);

  // Mock addresses for initial display
  useEffect(() => {
    const mockAddresses = [
      {
        id: 1,
        fullName: "Nguyễn Văn A",
        phoneNumber: "0123456789",
        address: "Phường Bến Nghé, Quận 1, Hồ Chí Minh",
        type: "home",
      },
      {
        id: 2,
        fullName: "Trần Thị B",
        phoneNumber: "0987654321",
        address: "Phường Thanh Xuân Bắc, Quận Thanh Xuân, Hà Nội",
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
      case "province":
        if (!value) error = "Vui lòng chọn Tỉnh/Thành phố";
        break;
      case "district":
        if (!value) error = "Vui lòng chọn Quận/Huyện";
        break;
      case "ward":
        if (!value) error = "Vui lòng chọn Phường/Xã";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert province and district values to integers
    const parsedValue =
      name === "province" || name === "district" ? parseInt(value, 10) || "" : value;
    setNewAddress((prev) => ({ ...prev, [name]: parsedValue }));

    const error = validateField(name, parsedValue);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTypeChange = (e) => {
    setNewAddress((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleAddAddress = () => {
    const newErrors = {};
    ["fullName", "phoneNumber", "province", "district", "ward"].forEach((field) => {
      const error = validateField(field, newAddress[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Construct full address string
    const provinceName = provinces.find((p) => p.ProvinceID === newAddress.province)?.ProvinceName || "";
    const districtName = districts.find((d) => d.DistrictID === newAddress.district)?.DistrictName || "";
    const wardName = wards.find((w) => w.WardCode === newAddress.ward)?.WardName || "";

    const fullAddress = `${wardName}, ${districtName}, ${provinceName}`;

    const newAddressEntry = {
      id: addresses.length + 1,
      fullName: newAddress.fullName,
      phoneNumber: newAddress.phoneNumber,
      address: fullAddress,
      type: newAddress.type,
    };

    setAddresses([...addresses, newAddressEntry]);
    setNewAddress({ fullName: "", phoneNumber: "", province: "", district: "", ward: "", type: "home" });
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
                  padding="10px"
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
            {isLoading && <p className="text-gray-500">Đang tải...</p>}
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
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
              <label htmlFor="province" className="text-sm font-semibold mb-2 block">
                Tỉnh/Thành phố
              </label>
              <select
                id="province"
                name="province"
                value={newAddress.province}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                disabled={isLoading}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces
                  .filter((province) => province.Status === 1)
                  .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
                  .map((province) => (
                    <option key={province.ProvinceID} value={province.ProvinceID}>
                      {province.ProvinceName}
                    </option>
                  ))}
              </select>
              {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="district" className="text-sm font-semibold mb-2 block">
                Quận/Huyện
              </label>
              <select
                id="district"
                name="district"
                value={newAddress.district}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                disabled={!newAddress.province || isLoading}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="ward" className="text-sm font-semibold mb-2 block">
                Phường/Xã
              </label>
              <select
                id="ward"
                name="ward"
                value={newAddress.ward}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                disabled={!newAddress.district || isLoading}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
              {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}
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
                padding="15px"
              />
              <Button
                text="Hoàn thành"
                onClick={handleAddAddress}
                padding="15px"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Address;