import { useState } from "react";
import { Coins } from "lucide-react";
import QuantityInput from "../../ui/QuantityInput"

export default function PurchaseModal({ isOpen, onClose, item, userCoins, onConfirm }) {
  if (!item || !isOpen) return null;

  const [quantity, setQuantity] = useState(1);
  const totalCost = item.price * quantity;
  const canPurchase = userCoins >= totalCost;

  const handleQuantityChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold">Xác nhận trao đổi</h2>
        <p className="text-gray-600 text-sm">Bạn đang trao đổi vật phẩm này.</p>

        <div className="flex items-center gap-4 py-4">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-1/2 h-20 object-cover rounded-md"
          />
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <div className="flex items-center text-amber-600 mt-1">
              <Coins className="h-4 w-4 mr-1" />
              {item.price} coins / cái
            </div>
          </div>
        </div>

        {/* Nhập số lượng */}
        <div className="flex justify-between items-center mt-4">
          <span>Số lượng:</span>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="border px-2 py-1 rounded-md w-16 text-center"
            min="1"
          />
        </div>

        {/* Tính toán số dư */}
        <div className="bg-gray-50 p-3 rounded-md mt-4">
          <div className="flex justify-between items-center">
            <span>Tổng giá:</span>
            <span className="font-medium">{totalCost} coins</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>Số dư hiện tại:</span>
            <span className="font-medium">{userCoins} coins</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>Số dư sau thay đổi:</span>
            <span className={`font-medium ${canPurchase ? "" : "text-red-500"}`}>
              {userCoins - totalCost} coins
            </span>
          </div>
        </div>

        {/* Nút xác nhận */}
        <div className="flex justify-between mt-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border !rounded-md hover:bg-gray-100 transition"
          >
            Thoát
          </button>

          <button 
            onClick={() => onConfirm(quantity)}
            disabled={!canPurchase} 
            className={`w-1/2 p-2 !rounded-md text-white bg-[#0B6E4F]`}
          >
            {canPurchase ? "Xác nhận giao dịch" : "Không đủ coins"}
          </button>
        </div>
      </div>
    </div>
  );
}
