import { useState, useEffect, useCallback } from "react";
import CoinBalance from "./CoinBalance";
import ItemCard from "./ItemCard";
import PurchaseModal from "./PurchaseModal";
import CreateItemForm from "../../ui/form/CreateItemForm";
import MarketplaceItemCard from "./MarketplaceItemCard";
import { getUserApi, purchaseItemApi } from "../../../utils/api";
import {
  Leaf,
  ShoppingBag,
  Search,
  ArrowDownWideNarrow,
  Plus,
  Filter,
  Grid2X2,
  LayoutList,
} from "lucide-react";

const marketplaceCategories = [
  { key: "all", name: "Tất cả" },
  { key: "recycled", name: "Đồ tái chế" },
  { key: "handicraft", name: "Đồ thủ công" },
  { key: "organic", name: "Sản phẩm hữu cơ" },
  { key: "plants", name: "Cây trồng" },
  { key: "other", name: "Khác" },
];

export default function ItemCatalog({ items }) {
  const [user, setUser] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("redeem");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Marketplace state
  const [marketView, setMarketView] = useState("browse");
  const [myItems, setMyItems] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [marketListView, setMarketListView] = useState("grid");
  const [marketCategory, setMarketCategory] = useState("all");

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

    // Mock data for marketplace items
    const mockUserItems = [
      {
        id: "m1",
        name: "Túi tái chế từ chai nhựa",
        description:
          "Túi đựng đồ được làm từ 100% chai nhựa tái chế, thân thiện với môi trường",
        price: 50,
        stock: 3,
        image:
          "https://images.unsplash.com/photo-1696492655666-703f94a2d944?w=600&auto=format&fit=crop",
        userId: "user123",
        status: "available",
        category: "recycled",
        condition: "new",
        viewCount: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: "m2",
        name: "Chậu cây từ vỏ dừa",
        description: "Chậu cây làm từ vỏ dừa, 100% tự nhiên và tự phân hủy",
        price: 35,
        stock: 5,
        image:
          "https://images.unsplash.com/photo-1696342940032-dbd0c599c97b?w=600&auto=format&fit=crop",
        userId: "user123",
        status: "available",
        category: "handicraft",
        condition: "new",
        viewCount: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: "m3",
        name: "Phân bón hữu cơ compost",
        description: "Phân bón từ rác thải hữu cơ, tốt cho cây trồng",
        price: 20,
        stock: 10,
        image:
          "https://images.unsplash.com/photo-1617594930337-0452649f4f7c?w=600&auto=format&fit=crop",
        userId: "user123",
        status: "available",
        category: "organic",
        condition: "new",
        viewCount: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: "m4",
        name: "Cây sen đá mini",
        description: "Sen đá nhỏ xinh, dễ chăm sóc, trang trí bàn làm việc",
        price: 40,
        stock: 2,
        image:
          "https://images.unsplash.com/photo-1590159762570-75899e3a928d?w=600&auto=format&fit=crop",
        userId: "user123",
        status: "available",
        category: "plants",
        condition: "new",
        viewCount: 15,
        createdAt: new Date().toISOString(),
      },
    ];

    setMyItems(mockUserItems);
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

  // Marketplace functions
  const handleAddItem = () => {
    setItemToEdit(null);
    setShowCreateForm(true);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setShowCreateForm(true);
  };

  const handleDeleteItem = (itemId) => {
    setMyItems((prev) => prev.filter((item) => item.id !== itemId));
    alert("Sản phẩm đã được xóa thành công!");
  };

  const handleSubmitItem = (formData, isEditing) => {
    if (isEditing) {
      // Update existing item
      setMyItems((prev) =>
        prev.map((item) =>
          item.id === itemToEdit.id ? { ...item, ...formData } : item
        )
      );
      alert("Cập nhật sản phẩm thành công!");
    } else {
      // Add new item
      const newItem = {
        ...formData,
        id: `m${Date.now()}`,
        userId: user?.id || "user123",
        createdAt: new Date().toISOString(),
        viewCount: 0,
      };
      setMyItems((prev) => [...prev, newItem]);
      alert("Thêm sản phẩm mới thành công!");
    }
    setShowCreateForm(false);
  };

  const handleCancelForm = () => {
    setShowCreateForm(false);
    setItemToEdit(null);
  };

  // Filter marketplace items by category
  const filteredMarketItems = myItems.filter((item) => {
    if (marketCategory === "all") return true;
    return item.category === marketCategory;
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

      {/* Search and Filter Bar - For Redeem tab */}
      {activeTab === "redeem" && (
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
      )}

      {/* Content Area - Redeem Tab */}
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

      {/* Content Area - Market Tab */}
      {activeTab === "market" && (
        <div className="space-y-6">
          {/* Market Navigation */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                  marketView === "browse"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setMarketView("browse")}
              >
                Sản phẩm của tôi
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                  marketView === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setMarketView("all")}
              >
                Tất cả sản phẩm
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm sản phẩm
              </button>
            </div>
          </div>

          {/* Create/Edit form */}
          {showCreateForm && (
            <CreateItemForm
              item={itemToEdit}
              onSubmit={handleSubmitItem}
              onCancel={handleCancelForm}
            />
          )}

          {/* Marketplace content */}
          {marketView === "browse" && !showCreateForm && (
            <>
              {/* Marketplace filters */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {marketplaceCategories.map((category) => (
                    <button
                      key={category.key}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        marketCategory === category.key
                          ? "bg-emerald-100 text-emerald-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setMarketCategory(category.key)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className={`p-2 ${
                      marketListView === "grid" ? "bg-gray-100" : "bg-white"
                    }`}
                    onClick={() => setMarketListView("grid")}
                  >
                    <Grid2X2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    className={`p-2 ${
                      marketListView === "list" ? "bg-gray-100" : "bg-white"
                    }`}
                    onClick={() => setMarketListView("list")}
                  >
                    <LayoutList className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Marketplace items */}
              {filteredMarketItems.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <Leaf className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Chưa có sản phẩm nào
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Bạn chưa đăng sản phẩm nào để trao đổi. Hãy chia sẻ sản phẩm
                    xanh của bạn với cộng đồng!
                  </p>
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Thêm sản phẩm đầu tiên
                  </button>
                </div>
              ) : (
                <div
                  className={
                    marketListView === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "space-y-4"
                  }
                >
                  {filteredMarketItems.map((item) => (
                    <MarketplaceItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* All products view - Coming soon */}
          {marketView === "all" && !showCreateForm && (
            <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
              <Leaf className="h-12 w-12 mx-auto text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tính năng đang phát triển
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Chúng tôi đang hoàn thiện tính năng xem tất cả sản phẩm từ cộng
                đồng. Bạn đã có thể tạo sản phẩm cho riêng mình trong tab "Sản
                phẩm của tôi".
              </p>
            </div>
          )}
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
