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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        if (response) {
          setUser(response.data);
          setUserCoins(response.data.coins || 0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setUserCoins(user.coins || 0);
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
        seller_id: selectedItem.owner_id,
        name: selectedItem.name,
        quantity: quantity,
      });
  
      if (response.data && response.data.message === "Purchase successful") {
        const updatedCoins = userCoins - totalCost;
        setUser({ ...user, coins: updatedCoins });
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
    <div>
      <CoinBalance coins={userCoins} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onPurchase={handlePurchase}
            userCoins={userCoins}
          />
        ))}
      </div>

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
