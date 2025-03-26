import { Coins } from "lucide-react"

export default function PurchaseModal({ isOpen, onClose, item, userCoins, onConfirm }) {
  if (!item || !isOpen) return null // Tránh lỗi khi modal chưa mở hoặc item chưa chọn

  const canPurchase = userCoins >= item.price

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        {/* Header */}
        <h2 className="text-xl font-semibold">Confirm Exchange</h2>
        <p className="text-gray-600 text-sm">You are about to exchange coins for this item.</p>

        {/* Item Details */}
        <div className="flex items-center gap-4 py-4">
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-md"
          />
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <div className="flex items-center text-amber-600 mt-1">
              <Coins className="h-4 w-4 mr-1" />
              {item.price} coins
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex justify-between items-center">
            <span>Your balance:</span>
            <span className="font-medium">{userCoins} coins</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span>After exchange:</span>
            <span className="font-medium">{userCoins - item.price} coins</span>
          </div>
        </div>

        {/* Footer (Buttons) */}
        <div className="flex justify-between mt-4">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border !rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button 
            onClick={onConfirm} 
            disabled={!canPurchase} 
            className={`w-1/2 p-2 !rounded-md text-white bg-[#0B6E4F]`}
          >
            {canPurchase ? "Confirm Exchange" : "Insufficient Coins"}
          </button>
        </div>
      </div>
    </div>
  )
}
