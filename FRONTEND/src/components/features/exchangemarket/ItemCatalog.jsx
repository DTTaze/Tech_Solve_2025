import { useState, useEffect, useCallback, useMemo } from "react";
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
  Store,
  Package,
  CheckCircle,
  Clock,
  FileWarning,
  EyeOff,
  ClipboardEdit,
} from "lucide-react";

const marketplaceCategories = [
  { key: "all", name: "Tất cả" },
  { key: "recycled", name: "Đồ tái chế" },
  { key: "handicraft", name: "Đồ thủ công" },
  { key: "organic", name: "Sản phẩm hữu cơ" },
  { key: "plants", name: "Cây trồng" },
  { key: "other", name: "Khác" },
];

// Status definitions
const statusConfig = {
  displaying: { name: "Đang hiển thị", color: "emerald", Icon: CheckCircle },
  pending: { name: "Chờ duyệt", color: "amber", Icon: Clock },
  rejected: { name: "Bị từ chối", color: "red", Icon: FileWarning },
  hidden: { name: "Đã ẩn", color: "gray", Icon: EyeOff },
  draft: { name: "Tin nháp", color: "slate", Icon: ClipboardEdit },
};

const userItemStatuses = [
  { key: "all", name: "Tất cả", icon: Filter },
  { key: "displaying", name: "Đang hiển thị", icon: CheckCircle },
  { key: "pending", name: "Chờ duyệt", icon: Clock },
  { key: "rejected", name: "Bị từ chối", icon: FileWarning },
  { key: "hidden", name: "Đã ẩn", icon: EyeOff },
  { key: "draft", name: "Tin nháp", icon: ClipboardEdit },
];

// Status colors for pill badges
const statusColors = {
  displaying: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  hidden: "bg-gray-100 text-gray-700",
  draft: "bg-slate-100 text-slate-700",
  all: "bg-blue-100 text-blue-700",
};

// Helper function to translate category keys to display names
const getCategoryDisplayName = (key) => {
  const categories = {
    handicraft: "Đồ thủ công",
    recycled: "Đồ tái chế",
    organic: "Sản phẩm hữu cơ",
    plants: "Cây trồng",
    other: "Khác",
  };
  return categories[key] || "Không xác định";
};

export default function ItemCatalog({ items: propItems }) {
  const [user, setUser] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("redeem");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Marketplace state
  const [items, setItems] = useState(propItems || []); // Keep this for compatibility
  const [allItems, setAllItems] = useState([]); // Store items for the "all_items" view
  const [marketView, setMarketView] = useState("my_items");
  const [myItems, setMyItems] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [marketListView, setMarketListView] = useState("grid");
  const [marketCategory, setMarketCategory] = useState("all");
  const [marketStatusFilter, setMarketStatusFilter] = useState("all");
  const [marketSearchText, setMarketSearchText] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

    // Mock data for marketplace items (my items)
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
        status: "displaying",
        category: "recycled",
        condition: "new",
        viewCount: 12,
        createdAt: new Date().toISOString(),
        canPurchase: true,
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
        status: "pending",
        category: "handicraft",
        condition: "new",
        viewCount: 8,
        createdAt: new Date().toISOString(),
        canPurchase: false,
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
        status: "hidden",
        category: "organic",
        condition: "new",
        viewCount: 5,
        createdAt: new Date().toISOString(),
        canPurchase: false,
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
        status: "rejected",
        category: "plants",
        condition: "new",
        viewCount: 15,
        createdAt: new Date().toISOString(),
        canPurchase: false,
      },
    ];

    // Mock data for marketplace items (all items)
    const mockMarketItems = [
      {
        id: "market1",
        name: "Túi đeo chéo từ vải tái chế",
        description:
          "Túi đeo chéo thời trang làm từ vải tái chế thân thiện với môi trường",
        price: 65,
        stock: 8,
        image:
          "https://images.unsplash.com/photo-1622560480605-d83c661b6d4d?w=600&auto=format&fit=crop",
        userId: "otheruser1",
        userName: "GreenCrafter",
        status: "displaying",
        category: "recycled",
        condition: "new",
        viewCount: 48,
        createdAt: new Date("2023-09-15").toISOString(),
        canPurchase: true,
      },
      {
        id: "market2",
        name: "Bộ hộp cơm tre tự nhiên",
        description:
          "Bộ hộp đựng cơm làm từ tre tự nhiên, không độc hại, thay thế hộp nhựa",
        price: 85,
        stock: 12,
        image:
          "https://images.unsplash.com/photo-1584473457493-83958d172d3c?w=600&auto=format&fit=crop",
        userId: "otheruser2",
        userName: "EcoStore",
        status: "displaying",
        category: "organic",
        condition: "new",
        viewCount: 73,
        createdAt: new Date("2023-10-22").toISOString(),
        canPurchase: true,
      },
      {
        id: "market3",
        name: "Bình nước thủy tinh tái chế",
        description: "Bình nước thủy tinh 100% tái chế, giảm rác thải nhựa",
        price: 45,
        stock: 20,
        image:
          "https://images.unsplash.com/photo-1616483039669-2b6737a02e1a?w=600&auto=format&fit=crop",
        userId: "otheruser3",
        userName: "EcoBuddy",
        status: "displaying",
        category: "recycled",
        condition: "new",
        viewCount: 102,
        createdAt: new Date("2023-11-05").toISOString(),
        canPurchase: true,
      },
      {
        id: "market4",
        name: "Chậu cây từ giấy tái chế",
        description: "Chậu cây làm từ giấy tái chế, tự phân hủy 100%",
        price: 30,
        stock: 15,
        image:
          "https://images.unsplash.com/photo-1614050231891-38b54b91abcb?w=600&auto=format&fit=crop",
        userId: "otheruser2",
        userName: "EcoStore",
        status: "displaying",
        category: "plants",
        condition: "new",
        viewCount: 55,
        createdAt: new Date("2023-12-10").toISOString(),
        canPurchase: true,
      },
    ];

    setMyItems(mockUserItems);

    // Use provided items or mock data for all items view
    if (propItems && propItems.length > 0) {
      setAllItems(propItems);
      setItems(propItems);
    } else {
      setAllItems(mockMarketItems);
      setItems(mockMarketItems);
    }

    console.log("MockUserItems:", mockUserItems);
    console.log("MockMarketItems:", mockMarketItems);

    // Add inside the useEffect, after setting both states
    console.log("Items state initialized:", items);
    console.log("AllItems state initialized:", allItems);
    console.log("MyItems state initialized:", myItems);
  }, [propItems]);

  useEffect(() => {
    if (user) {
      setUserCoins(user.coins?.amount || 0);
    }
  }, [user]);

  const handlePurchase = useCallback(
    (item) => {
      console.log("Handling purchase for item:", item);

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

  // Filter and sort items (for the Redeem tab)
  const filteredItems = useMemo(() => {
    if (!items || items.length === 0) return [];

    return items.filter((item) => {
      if (!searchQuery) return true;
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [items, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
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
  }, [filteredItems, sortOption]);

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

  // Filter market items based on view and filters
  const filteredMarketItems = useMemo(() => {
    // Use myItems for "my_items" view, and allItems for "all_items" view
    const sourceItems =
      marketView === "my_items" ? myItems || [] : allItems || [];
    console.log(`Filtering for ${marketView} view, source items:`, sourceItems);

    if (!sourceItems || sourceItems.length === 0) {
      console.log(`No source items found for ${marketView} view`);
      return [];
    }

    let filtered = [...sourceItems]; // Create a copy of the array to avoid mutation issues

    if (marketView === "my_items") {
      // Filter by status if a specific status is selected
      if (marketStatusFilter !== "all") {
        filtered = filtered.filter(
          (item) => item.status === marketStatusFilter
        );
      }
    } else {
      // All items view - only show items with 'displaying' status
      filtered = filtered.filter((item) => item.status === "displaying");

      // Filter by category if a specific category is selected
      if (marketCategory !== "all") {
        filtered = filtered.filter((item) => item.category === marketCategory);
      }
    }

    // Apply search filter if search text exists
    if (marketSearchText) {
      const searchLower = marketSearchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }

    console.log(
      `Filtered ${filtered.length} items for ${marketView} view:`,
      filtered
    );
    return filtered;
  }, [
    allItems,
    myItems,
    marketView,
    marketCategory,
    marketStatusFilter,
    marketSearchText,
  ]);

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
              <Store className="h-4 w-4 mr-2" />
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
          {/* Market View Navigation & Add Button */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                  marketView === "my_items"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setMarketView("my_items")}
              >
                <Package className="h-4 w-4 mr-1.5" />
                Sản phẩm của tôi
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${
                  marketView === "all_items"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setMarketView("all_items")}
              >
                <Store className="h-4 w-4 mr-1.5" />
                Tất cả sản phẩm
              </button>
            </div>
            {/* Add item button shown only in 'my_items' view and when form is not open */}
            {marketView === "my_items" && !showCreateForm && (
              <button
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center sm:justify-start"
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm sản phẩm
              </button>
            )}
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
          {!showCreateForm && (
            <>
              {/* Filters Bar (Context-dependent) */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
                {/* Search and view toggle row */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  {/* Search for marketplace items */}
                  <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={marketSearchText}
                      onChange={(e) => setMarketSearchText(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                    />
                    {marketSearchText && (
                      <button
                        onClick={() => setMarketSearchText("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <span className="text-gray-400 hover:text-gray-600">
                          ✕
                        </span>
                      </button>
                    )}
                  </div>

                  {/* View Toggle */}
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className={`p-2 ${
                        marketListView === "grid" ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-50`}
                      onClick={() => setMarketListView("grid")}
                    >
                      <Grid2X2 className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      className={`p-2 ${
                        marketListView === "list" ? "bg-gray-100" : "bg-white"
                      } hover:bg-gray-50`}
                      onClick={() => setMarketListView("list")}
                    >
                      <LayoutList className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {(marketView === "my_items"
                    ? userItemStatuses
                    : marketplaceCategories
                  ).map((filterItem) => {
                    const isActive =
                      marketView === "my_items"
                        ? marketStatusFilter === filterItem.key
                        : marketCategory === filterItem.key;
                    const filterKey = filterItem.key;
                    const filterName = filterItem.name;
                    const Icon = marketView === "my_items" && filterItem.icon;
                    const statusColor =
                      marketView === "my_items"
                        ? statusColors[filterKey] || statusColors.all
                        : isActive
                        ? "bg-emerald-100 text-emerald-700 font-medium"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200";

                    return (
                      <button
                        key={filterKey}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center transition-all duration-150 ${
                          isActive
                            ? marketView === "my_items"
                              ? `${statusColor} font-medium shadow-sm`
                              : "bg-emerald-100 text-emerald-700 font-medium"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        onClick={() => {
                          if (marketView === "my_items") {
                            setMarketStatusFilter(filterKey);
                          } else {
                            setMarketCategory(filterKey);
                          }
                        }}
                      >
                        {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
                        {filterName}
                        {isActive && marketView === "my_items" && (
                          <span className="ml-1.5 bg-white bg-opacity-30 text-xs font-normal rounded-full px-1.5 py-0.5">
                            {
                              filteredMarketItems.filter((item) =>
                                filterKey === "all"
                                  ? true
                                  : item.status === filterKey
                              ).length
                            }
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items Grid/List */}
              {filteredMarketItems.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                  <Leaf className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Không có sản phẩm nào phù hợp
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    {marketView === "my_items"
                      ? "Bạn chưa có sản phẩm nào với trạng thái này."
                      : "Hiện chưa có sản phẩm nào trong danh mục này."}
                    {marketView === "my_items" &&
                      marketStatusFilter === "all" &&
                      "Hãy thử thêm sản phẩm mới!"}
                  </p>
                  {marketView === "my_items" && (
                    <button
                      onClick={handleAddItem}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 inline mr-1" />
                      Thêm sản phẩm
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className={
                    marketListView === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "space-y-4"
                  }
                >
                  {marketListView === "list" ? (
                    // List View
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Sản phẩm
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Danh mục
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Giá
                            </th>
                            {marketView === "my_items" && (
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Trạng thái
                              </th>
                            )}
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Ngày đăng
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredMarketItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0">
                                    <img
                                      className="h-10 w-10 rounded-md object-cover"
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                      {item.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {getCategoryDisplayName(item.category)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm font-medium text-amber-600">
                                  {item.price}
                                  <img
                                    src="/assets/icons/coin.png"
                                    alt="coins"
                                    className="ml-1 h-4 w-4"
                                  />
                                </div>
                              </td>
                              {marketView === "my_items" && (
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      statusColors[item.status] ||
                                      statusColors.draft
                                    }`}
                                  >
                                    {statusConfig[item.status]?.name ||
                                      statusConfig.draft.name}
                                  </span>
                                </td>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.createdAt &&
                                  new Date(item.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                  {marketView === "my_items" ? (
                                    <>
                                      <button
                                        onClick={() => handleEditItem(item)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        Sửa
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteItem(item.id)
                                        }
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Xóa
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSelectedItem(item);
                                          setShowDetailsModal(true);
                                        }}
                                        className="text-emerald-600 hover:text-emerald-800"
                                      >
                                        Xem chi tiết
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSelectedItem(item);
                                          handlePurchase(item);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        disabled={!item.canPurchase}
                                      >
                                        Mua
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // Grid View (original)
                    filteredMarketItems.map((item) => (
                      <MarketplaceItemCard
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                        onPurchase={handlePurchase}
                        showDetailedStatus={marketView === "my_items"}
                        viewMode={marketView}
                        fetchItems={() => {
                          // This would normally refresh the items list
                          // For now just providing a placeholder function
                          console.log("Refreshing items");
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <>
          <PurchaseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            item={selectedItem}
            userCoins={userCoins}
            onConfirm={confirmPurchase}
          />

          {/* Details Modal */}
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${
              showDetailsModal ? "visible" : "invisible"
            }`}
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-30"
              onClick={() => setShowDetailsModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10 mx-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <span className="text-xl">✕</span>
              </button>

              <h2 className="text-2xl font-semibold mb-4">
                {selectedItem.name}
              </h2>

              <div className="mb-4">
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              <div className="mb-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-amber-600 flex items-center">
                  {selectedItem.price}
                  <img
                    src="/assets/icons/coin.png"
                    alt="coins"
                    className="ml-1 h-5 w-5"
                  />
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {getCategoryDisplayName(selectedItem.category)}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">Mô tả</h3>
                <p className="text-gray-600">{selectedItem.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-1">
                  Thông tin sản phẩm
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Số lượng còn lại:</div>
                  <div className="text-gray-700 font-medium">
                    {selectedItem.stock || "Không xác định"}
                  </div>

                  <div className="text-gray-500">Tình trạng:</div>
                  <div className="text-gray-700 font-medium">
                    {selectedItem.condition === "new" ? "Mới" : "Cũ"}
                  </div>

                  <div className="text-gray-500">Ngày đăng:</div>
                  <div className="text-gray-700 font-medium">
                    {selectedItem.createdAt &&
                      new Date(selectedItem.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedItem.canPurchase}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Item Details Modal */}
      {selectedItem && showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setShowDetailsModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6 z-10 mx-4">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl">✕</span>
            </button>

            <h2 className="text-2xl font-semibold mb-4">{selectedItem.name}</h2>

            <div className="mb-4">
              <img
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="mb-3 flex justify-between items-center">
              <span className="text-lg font-semibold text-amber-600 flex items-center">
                {selectedItem.price}
                <img
                  src="/assets/icons/coin.png"
                  alt="coins"
                  className="ml-1 h-5 w-5"
                />
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {getCategoryDisplayName(selectedItem.category)}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Mô tả</h3>
              <p className="text-gray-600">{selectedItem.description}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-700 mb-1">
                Thông tin sản phẩm
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Số lượng còn lại:</div>
                <div className="text-gray-700 font-medium">
                  {selectedItem.stock || "Không xác định"}
                </div>

                <div className="text-gray-500">Tình trạng:</div>
                <div className="text-gray-700 font-medium">
                  {selectedItem.condition === "new" ? "Mới" : "Cũ"}
                </div>

                <div className="text-gray-500">Ngày đăng:</div>
                <div className="text-gray-700 font-medium">
                  {selectedItem.createdAt &&
                    new Date(selectedItem.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handlePurchase(selectedItem);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedItem.canPurchase}
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
