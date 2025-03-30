import { useState, useEffect, useCallback } from "react";
import CoinBalance from "./CoinBalance";
import ItemCard from "./ItemCard";
import PurchaseModal from "./PurchaseModal";
import { getUserApi, updateUserApi } from "../../utils/api";

export default function ItemCatalog({ items }) {
  const [user, setUser] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserApi();
        console.log("check user res coins",response.data)
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
    if (!item) {
      return;
    }
  
    console.log(userCoins); 
  
    if (userCoins < item.price) {
      alert("Bạn không có đủ số coins để giao dịch!");
      return;
    }
  
    setSelectedItem(item);
    setIsModalOpen(true);
  }, [userCoins]);
  
  const confirmPurchase = useCallback(async (quantity) => {
    if (!selectedItem) return;
  
    const totalCost = selectedItem.price * quantity;
    if (userCoins < totalCost) {
      alert("Bạn không có đủ số coins để giao dịch!");
      return;
    }
  
    const updatedCoins = userCoins - totalCost;
    const updatedUser = { ...user, coins: updatedCoins };
  
    try {
      console.log("🔄 Đang gửi request update:", user.id, updatedUser);
      await updateUserApi(user.id, updatedUser);
      console.log("✅ API cập nhật thành công!");
      
      setUser(updatedUser);  
      setUserCoins(updatedCoins); 
      setIsModalOpen(false);
      alert(`Trao đổi thành công ${quantity} ${selectedItem.name}!`);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật số dư:", error.response ? error.response.data : error.message);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  }, [selectedItem, user, userCoins]);  
  
  return (
    <div>
      <CoinBalance coins={userCoins} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {items.map((item) => (
          <ItemCard
            // key={item.id}
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
