import { useState, useEffect, useRef, useContext } from "react";
import { Coins, X, ShoppingBag, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShippingInfoModal from "./ShippingInfoModal";
import { getReceiverInfoByUserIDAPI, PreviewOrderWithoutOrderCode } from "../../../utils/api";
import { AuthContext } from "../../../contexts/auth.context";

export default function PurchaseModal({
  isOpen,
  onClose,
  item,
  userCoins,
  onConfirm,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const modalRef = useRef(null);
  const shippingModalRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const token = "c3f24415-29b9-11f0-9b81-222185cb68c8";
  const shop_id = 196506;

  useEffect(() => {
    async function fetchDefaultShipping() {
      if (isOpen && auth.user?.id) {
        try {
          setIsLoadingShipping(true);
          const response = await getReceiverInfoByUserIDAPI(auth.user.id);
          if (response?.data?.length > 0) {
            const defaultShipping = response.data.find((info) => info.is_default) || response.data[0];
            setShippingInfo(defaultShipping);
            await fetchShippingFee(defaultShipping);
          }
        } catch (error) {
          console.error("Error fetching shipping info:", error);
        } finally {
          setIsLoadingShipping(false);
        }
      }
    }
    fetchDefaultShipping();
  }, [isOpen, auth.user?.id, item?.id]);

  const fetchShippingFee = async (selectedShipping) => {
    try {
      const orderData = {
        to_name: selectedShipping.to_name,
        to_phone: selectedShipping.to_phone,
        to_address: selectedShipping.to_address,
        to_ward_name: selectedShipping.to_ward_name,
        to_district_name: selectedShipping.to_district_name,
        service_type_id: 2,
        payment_type_id: 2,
        required_note: "CHOXEMHANGKHONGTHU",
        weight: item.weight || 200,
        length: item.length || 15,
        width: item.width || 15,
        height: item.height || 15,
        items: [
          {
            name: item.name,
            code: item.id.toString(),
            quantity: quantity,
            price: item.price,
            weight: item.weight || 200,
            length: item.length || 12,
            width: item.width || 12,
            height: item.height || 12,
            category: {
              level1: item.category || "Khác",
            },
          },
        ],
      };

      const feeResponse = await PreviewOrderWithoutOrderCode(orderData, token, shop_id);
      setShippingFee(feeResponse?.data?.total_fee || 0);
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
      setShippingFee(0);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        (!shippingModalRef.current || !shippingModalRef.current.contains(event.target))
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setIsProcessing(false);
      setShippingInfo(null);
      setShippingFee(0);
      setIsShippingModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (shippingInfo && isOpen) {
      fetchShippingFee(shippingInfo);
    }
  }, [quantity, shippingInfo]);

  if (!item || !isOpen) return null;

  const totalCost = item.price * quantity + shippingFee;
  const canPurchase = userCoins >= totalCost && quantity <= item.stock;
  const maxQuantity = Math.min(Math.floor(userCoins / item.price), item.stock);

  const handleQuantityChange = (e) => {
    const value = Math.max(
      1,
      Math.min(maxQuantity, parseInt(e.target.value) || 1)
    );
    setQuantity(value);
  };

  const handleConfirm = () => {
    if (!shippingInfo) {
      alert("Vui lòng chọn thông tin giao hàng!");
      return;
    }
    if (!shippingInfo.to_ward_name || !shippingInfo.to_district_name) {
      alert("Thông tin giao hàng thiếu phường/xã hoặc quận/huyện!");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(quantity, {
        ...shippingInfo,
        shippingFee,
      });
      setIsProcessing(false);
    }, 800);
  };

  const handleChangeShipping = () => {
    setIsShippingModalOpen(true);
  };

  const handleSelectShipping = async (selectedInfo) => {
    try {
      setIsLoadingShipping(true);
      setShippingInfo(selectedInfo);
      await fetchShippingFee(selectedInfo);
      setIsShippingModalOpen(false);
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 py-4 px-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white hover:text-emerald-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Xác nhận trao đổi
              </h2>
              <p className="text-emerald-100 text-sm mt-1">
                Vui lòng xác nhận thông tin giao dịch của bạn
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Shipping Information */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">Thông tin nhận hàng</h3>
                  <button
                    onClick={handleChangeShipping}
                    className="text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    Thay đổi
                  </button>
                </div>
                {isLoadingShipping ? (
                  <div className="animate-pulse bg-gray-100 p-3 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : shippingInfo ? (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-800">{shippingInfo.to_name}</p>
                    <p className="text-sm text-gray-600">{shippingInfo.to_address}</p>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.to_ward_name}, {shippingInfo.to_district_name}, {shippingInfo.to_province_name}
                    </p>
                    <p className="text-sm text-gray-600">{shippingInfo.to_phone}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-600">Chưa có thông tin giao hàng</p>
                )}
              </div>

              {/* Item Details */}
              <div className="flex items-center gap-4 py-2 border-b border-gray-100 pb-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex items-center text-emerald-600 mt-1">
                    <Coins className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{item.price} xu / đơn vị</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Còn lại: {item.stock} sản phẩm
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-between items-center mt-5">
                <span className="text-gray-700">Số lượng:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="border-y border-gray-300 h-8 w-12 text-center focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="bg-emerald-50 p-4 rounded-lg mt-5 border border-emerald-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá sản phẩm:</span>
                  <span className="font-medium text-emerald-600">
                    {item.price * quantity} xu
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Phí giao hàng:</span>
                  <span className="font-medium text-emerald-600">{shippingFee} xu</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-100">
                  <span className="text-gray-600">Tổng giá:</span>
                  <span className="font-medium text-emerald-600">{totalCost} xu</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Số dư hiện tại:</span>
                  <span className="font-medium text-emerald-600">{userCoins} xu</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-100">
                  <span className="text-gray-600">Số dư sau giao dịch:</span>
                  <span
                    className={`font-medium ${
                      canPurchase ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {userCoins - totalCost} xu
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!canPurchase || isProcessing || !shippingInfo}
                  className={`flex-1 py-2.5 rounded-lg text-white font-medium flex items-center justify-center ${
                    canPurchase && !isProcessing && shippingInfo
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Đang xử lý...</span>
                  ) : !canPurchase ? (
                    "Không đủ điều kiện"
                  ) : !shippingInfo ? (
                    "Chọn thông tin giao hàng"
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Xác nhận
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Shipping Info Modal */}
          {isShippingModalOpen && (
            <ShippingInfoModal
              isOpen={isShippingModalOpen}
              onClose={() => setIsShippingModalOpen(false)}
              onSelect={handleSelectShipping}
              ref={shippingModalRef}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}