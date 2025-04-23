import { useState, useEffect, useCallback } from "react";
import CoinBalance from "./CoinBalance";
import ItemCard from "./ItemCard";
import PurchaseModal from "./PurchaseModal";
import { getUserApi, purchaseItemApi } from "../../../utils/api";
import { Leaf, ShoppingBag, Search, ArrowDownWideNarrow } from "lucide-react";

export default function ItemCatalog({ items }) {
  const [user, setUser] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("redeem");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handlePurchase = useCallback(
    (item) => {
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
    },
    [userCoins]
  );

  const confirmPurchase = useCallback(
    async (quantity) => {
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
    },
    [selectedItem, user, userCoins]
  );

  // Filter and sort items
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="flex flex-col">
      {/* Balance and Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-6 mb-8 shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center">
          <Leaf className="h-6 w-6 mr-2" />
          Trung tâm trao đổi xanh
        </h1>
        <p className="text-emerald-50 mb-6 max-w-2xl">
          Chuyển đổi coins của bạn thành các vật phẩm bền vững và thân thiện với
          môi trường. Mỗi trao đổi đều góp phần vào sứ mệnh bảo vệ môi trường
          toàn cầu.
        </p>
        <CoinBalance coins={userCoins} />
      </div>

      {/* Tabs navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-wrap">
          <button
            className={`relative px-6 py-3 font-medium text-sm transition-colors
              ${
                activeTab === "redeem"
                  ? "text-emerald-600 font-semibold border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            onClick={() => setActiveTab("redeem")}
          >
            <div className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Đổi quà
            </div>
          </button>
          <button
            className={`relative px-6 py-3 font-medium text-sm transition-colors
              ${
                activeTab === "market"
                  ? "text-emerald-600 font-semibold border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            onClick={() => setActiveTab("market")}
          >
            <div className="flex items-center">
              <Leaf className="h-4 w-4 mr-2" />
              Chợ trao đổi
            </div>
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm vật phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium flex items-center"
            >
              <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
              Sắp xếp
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      sortOption === "default"
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSortOption("default");
                      setIsFilterOpen(false);
                    }}
                  >
                    Mặc định
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      sortOption === "price-asc"
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSortOption("price-asc");
                      setIsFilterOpen(false);
                    }}
                  >
                    Giá thấp đến cao
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      sortOption === "price-desc"
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSortOption("price-desc");
                      setIsFilterOpen(false);
                    }}
                  >
                    Giá cao đến thấp
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      sortOption === "name-asc"
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSortOption("name-asc");
                      setIsFilterOpen(false);
                    }}
                  >
                    Tên A-Z
                  </button>
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      sortOption === "name-desc"
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setSortOption("name-desc");
                      setIsFilterOpen(false);
                    }}
                  >
                    Tên Z-A
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "redeem" && (
        <div>
          {sortedItems.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <img
                src="/placeholder.svg"
                alt="No items"
                className="w-20 h-20 mx-auto mb-4 opacity-50"
              />
              <p className="text-gray-500">Không tìm thấy vật phẩm phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onPurchase={handlePurchase}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "market" && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <Leaf className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Chợ trao đổi đang phát triển
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Chúng tôi đang xây dựng nền tảng trao đổi trực tiếp giữa người dùng.
            Tính năng này sẽ sớm ra mắt!
          </p>
        </div>
      )}

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
