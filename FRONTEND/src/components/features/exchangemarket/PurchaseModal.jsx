import { useState, useEffect, useRef } from "react";
import { Coins, X, ShoppingBag, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PurchaseModal({
  isOpen,
  onClose,
  item,
  userCoins,
  onConfirm,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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
    }
  }, [isOpen]);

  if (!item || !isOpen) return null;

  const totalCost = item.price * quantity;
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
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm(quantity);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-600 py-4 px-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white hover:text-emerald-200 transition-colors"
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
              {/* Item details */}
              <div className="flex items-center gap-4 py-2 border-b border-gray-100 pb-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-lg">
                    {item.name}
                  </h3>
                  <div className="flex items-center text-emerald-600 mt-1">
                    <Coins className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{item.price}</span> coins /
                    đơn vị
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Còn lại: {item.stock} sản phẩm
                  </div>
                </div>
              </div>

              {/* Quantity selector */}
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
                    className="border-y border-gray-300 h-8 w-12 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    min="1"
                    max={maxQuantity}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(maxQuantity, quantity + 1))
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Transaction summary */}
              <div className="bg-emerald-50 p-4 rounded-lg mt-5 border border-emerald-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng giá:</span>
                  <span className="font-medium text-emerald-700">
                    {totalCost} coins
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Số dư hiện tại:</span>
                  <span className="font-medium text-emerald-700">
                    {userCoins} coins
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200">
                  <span className="text-gray-600">Số dư sau giao dịch:</span>
                  <span
                    className={`font-medium ${
                      canPurchase ? "text-emerald-700" : "text-red-500"
                    }`}
                  >
                    {userCoins - totalCost} coins
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  Hủy
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={!canPurchase || isProcessing}
                  className={`flex-1 py-2.5 rounded-lg text-white font-medium flex items-center justify-center ${
                    canPurchase && !isProcessing
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-pulse">Đang xử lý...</span>
                    </>
                  ) : !canPurchase ? (
                    "Không đủ điều kiện"
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
        </div>
      )}
    </AnimatePresence>
  );
}
