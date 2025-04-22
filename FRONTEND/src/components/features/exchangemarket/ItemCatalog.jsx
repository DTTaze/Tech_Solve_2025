import { useState, useEffect, useCallback } from "react";
import CoinBalance from "./CoinBalance";
import ItemCard from "./ItemCard";
import PurchaseModal from "./PurchaseModal";
import { getUserApi, purchaseItemApi } from "../../../utils/api";

export default function ItemCatalog({ items }) {
  const [user, setUser] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("redeem"); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        if (response) {
          setUser(response.data);
          setUserCoins(response.data.coins?.amount || 0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setUserCoins(user.coins?.amount || 0);
    }
  }, [user]);

  const handlePurchase = useCallback((item) => {
    if (!item || item.stock <= 0) {
      alert("Mặt hàng này hiện đã hết!");
      return;
    }
  
    if (userCoins < item.price) {
      alert("Bạn không có đủ số coins để giao dịch!");
      return;
    }
  
    setSelectedItem(item);
    setIsModalOpen(true);
  }, [userCoins]);

  const confirmPurchase = useCallback(async (quantity) => {
    if (!selectedItem || !user) return;
  
    const totalCost = selectedItem.price * quantity;
    if (userCoins < totalCost) {
      alert("Bạn không có đủ số coins để giao dịch!");
      return;
    }
  
    try {
      const response = await purchaseItemApi(user.id, selectedItem.id, {
        name: selectedItem.name,
        quantity: quantity,
      });
  
      if (response.data) {
        const updatedCoins = userCoins - totalCost;
        setUser({ ...user, coins: { amount: updatedCoins } });
        setUserCoins(updatedCoins);
        setIsModalOpen(false);
        alert(`Trao đổi thành công ${quantity} ${selectedItem.name}!`);
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi mua hàng:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }, [selectedItem, user, userCoins]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-48 p-4 border-r">
        <div
          className={`cursor-pointer mb-4 font-semibold ${activeTab === "redeem" ? "text-blue-500" : ""}`}
          onClick={() => setActiveTab("redeem")}
        >
          Đổi quà
        </div>
        <div
          className={`cursor-pointer font-semibold ${activeTab === "market" ? "text-blue-500" : ""}`}
          onClick={() => setActiveTab("market")}
        >
          Chợ trao đổi
        </div>
      </div>
  
      {/* Main Content */}
      <div className="flex-1 p-4">
        <CoinBalance coins={userCoins} />
  
        {activeTab === "redeem" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
  
        {activeTab === "market" && (
          <div className="mt-8">
            {/* Nội dung chợ trao đổi ở đây */}
            <p>Chợ trao đổi đang được phát triển...</p>
          </div>
        )}
      </div>
  
      {/* Modal */}
      {selectedItem && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          userCoins={userCoins}
          onConfirm={confirmPurchase}
        />
      )}
    </div>
  );
}
