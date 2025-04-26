import { useState, useEffect, useCallback, useMemo } from "react";
import { getUserApi, purchaseItemApi, getProductByIdUser, getAllProductsApi, getAllItemsApi } from "../../../utils/api";
import CatalogHeader from "./CatalogHeader";
import TabsNavigation from "./TabsNavigation";
import SearchFilterBar from "./SearchFilterBar";
import RedeemTab from "./RedeemTab";
import MarketViewNavigation from "./MarketViewNavigation";
import CreateItemModal from "./CreateItemModal";
import MarketplaceItemCard from "./MarketplaceItemCard";
import PurchaseModal from "./PurchaseModal";
import { Search, Grid2X2, LayoutList, Leaf, Plus, Filter, CheckCircle, Clock, FileWarning, EyeOff, ClipboardEdit } from "lucide-react";

const marketplaceCategories = [
  { key: "all", name: "Tất cả" },
  { key: "recycled", name: "Đồ tái chế" },
  { key: "handicraft", name: "Đồ thủ công" },
  { key: "organic", name: "Sản phẩm hữu cơ" },
  { key: "plants", name: "Cây trồng" },
  { key: "other", name: "Khác" },
];

const statusColors = {
  displaying: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  hidden: "bg-gray-100 text-gray-700",
  draft: "bg-slate-100 text-slate-700",
  all: "bg-blue-100 text-blue-700",
  public: "bg-emerald-100 text-emerald-700",
};

const userItemStatuses = [
  { key: "all", name: "Tất cả", icon: Filter },
  { key: "public", name: "Đang hiển thị", icon: CheckCircle },
  { key: "pending", name: "Chờ duyệt", icon: Clock },
  { key: "rejected", name: "Bị từ chối", icon: FileWarning },
  { key: "hidden", name: "Đã ẩn", icon: EyeOff },
  { key: "draft", name: "Tin nháp", icon: ClipboardEdit },
];

const statusConfig = {
  public: { name: "Đang hiển thị", color: "emerald" },
  pending: { name: "Chờ duyệt", color: "amber" },
  rejected: { name: "Bị từ chối", color: "red" },
  hidden: { name: "Đã ẩn", color: "gray" },
  draft: { name: "Tin nháp", color: "slate" },
};

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

function ItemCatalog({ items: propItems }) {
  const [user, setUser] = useState(null);
  const [userCoins, setUserCoins] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("redeem");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [items, setItems] = useState(propItems || []);
  const [allItems, setAllItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [marketView, setMarketView] = useState("my_items");
  const [marketListView, setMarketListView] = useState("grid");
  const [marketCategory, setMarketCategory] = useState("all");
  const [marketStatusFilter, setMarketStatusFilter] = useState("all");
  const [marketSearchText, setMarketSearchText] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getUserApi();
        if (userResponse) {
          setUser(userResponse.data);
          setUserCoins(userResponse.data.coins?.amount || 0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu người dùng, vui lòng thử lại sau!");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRedeemItems = async () => {
      if (activeTab === "redeem") {
        try {
          const itemsResponse = await getAllItemsApi();
          console.log("Dữ liệu từ getAllItemsApi:", itemsResponse);
          if (itemsResponse && itemsResponse.data) {
            const mappedItems = itemsResponse.data.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              category: item.category,
              status: item.post_status,
              condition: item.product_status,
              createdAt: item.created_at,
              image: item.images.length > 0 ? item.images[0] : null,
              stock: item.stock || null,
              canPurchase: item.post_status === "public",
              seller: item.User?.username || "Không xác định",
            }));
            setItems(mappedItems);
          }
        } catch (error) {
          console.error("Lỗi khi lấy sản phẩm cho tab đổi quà:", error);
          alert("Có lỗi xảy ra khi tải danh sách sản phẩm đổi quà, vui lòng thử lại sau!");
        }
      }
    };

    fetchRedeemItems();
  }, [activeTab]);

  useEffect(() => {
    const fetchMarketItems = async () => {
      if (activeTab === "market") {
        try {
          if (user && user.id && marketView === "my_items") {
            const productResponse = await getProductByIdUser(user.id);
            console.log("Dữ liệu từ getProductByIdUser: ", productResponse);
            if (productResponse && productResponse.data) {
              const mappedMyItems = productResponse.data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                status: item.post_status,
                condition: item.product_status,
                createdAt: item.created_at,
                image: item.images.length > 0 ? item.images[0] : null,
                stock: item.stock || null,
                canPurchase: item.post_status === "public",
                seller: item.User?.username || "Không xác định",
              }));
              setMyItems(mappedMyItems);
            }
          }

          if (marketView !== "my_items") {
            const allProductsResponse = await getAllProductsApi();
            console.log("Dữ liệu từ getAllProductsApi:", allProductsResponse);
            if (allProductsResponse && allProductsResponse.data) {
              const mappedAllItems = allProductsResponse.data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                status: item.post_status,
                condition: item.product_status,
                createdAt: item.created_at,
                image: item.images.length > 0 ? item.images[0] : null,
                stock: item.stock || null,
                canPurchase: item.post_status === "public",
                seller: item.User?.username || "Không xác định",
              }));
              setAllItems(mappedAllItems);
            }
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu sản phẩm cho chợ trao đổi:", error);
          alert("Có lỗi xảy ra khi tải danh sách sản phẩm chợ trao đổi, vui lòng thử lại sau!");
        }
      }
    };

    fetchMarketItems();
  }, [activeTab, marketView, user]);

  useEffect(() => {
    if (user) setUserCoins(user.coins?.amount || 0);
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

  const handleAddItem = () => {
    setItemToEdit(null);
    setShowCreateModal(true);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setShowCreateModal(true);
  };

  const handleDeleteItem = (itemId) => {
    setMyItems((prev) => prev.filter((item) => item.id !== itemId));
    alert("Sản phẩm đã được xóa thành công!");
  };

  const handleSubmitItem = (formData, isEditing) => {
    if (isEditing) {
      setMyItems((prev) =>
        prev.map((item) =>
          item.id === itemToEdit.id ? { ...item, ...formData } : item
        )
      );
      alert("Cập nhật sản phẩm thành công!");
    } else {
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
    setShowCreateModal(false);
  };

  const handleCancelForm = () => {
    setShowCreateModal(false);
    setItemToEdit(null);
  };

  const filteredMarketItems = useMemo(() => {
    const sourceItems = marketView === "my_items" ? myItems || [] : allItems || [];
    if (!sourceItems || sourceItems.length === 0) return [];
    let filtered = [...sourceItems];
    if (marketView === "my_items") {
      if (marketStatusFilter !== "all") {
        filtered = filtered.filter((item) => item.status === marketStatusFilter);
      }
    } else {
      filtered = filtered.filter((item) => item.status === "public");
      if (marketCategory !== "all") {
        filtered = filtered.filter((item) => item.category === marketCategory);
      }
    }
    if (marketSearchText) {
      const searchLower = marketSearchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [allItems, myItems, marketView, marketCategory, marketStatusFilter, marketSearchText]);

  return (
    <div className="flex flex-col">
      <CatalogHeader userCoins={userCoins} />
      <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "redeem" && (
        <>
          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortOption={sortOption}
            setSortOption={setSortOption}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />
          <RedeemTab sortedItems={sortedItems} handlePurchase={handlePurchase} />
        </>
      )}
      {activeTab === "market" && (
        <div className="space-y-6">
          <MarketViewNavigation
            marketView={marketView}
            setMarketView={setMarketView}
            showCreateForm={showCreateModal}
            handleAddItem={handleAddItem}
          />
          <CreateItemModal
            isOpen={showCreateModal}
            item={itemToEdit}
            onSubmit={handleSubmitItem}
            onCancel={handleCancelForm}
          />
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:w-auto sm:flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={marketSearchText}
                  onChange={(e) => setMarketSearchText(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
                {marketSearchText && (
                  <button
                    onClick={() => setMarketSearchText("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600">✕</span>
                  </button>
                )}
              </div>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className={`p-2 ${marketListView === "grid" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
                  onClick={() => setMarketListView("grid")}
                >
                  <Grid2X2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  className={`p-2 ${marketListView === "list" ? "bg-gray-100" : "bg-white"} hover:bg-gray-50`}
                  onClick={() => setMarketListView("list")}
                >
                  <LayoutList className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(marketView === "my_items" ? userItemStatuses : marketplaceCategories).map(
                (filterItem) => {
                  const isActive =
                    marketView === "my_items"
                      ? marketStatusFilter === filterItem.key
                      : marketCategory === filterItem.key;
                  const filterKey = filterItem.key;
                  const filterName = filterItem.name;
                  const Icon = marketView === "my_items" && filterItem.icon;
                  const statusColor = marketView === "my_items"
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
                      onClick={() =>
                        marketView === "my_items"
                          ? setMarketStatusFilter(filterKey)
                          : setMarketCategory(filterKey)
                      }
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
                      {filterName}
                      {isActive && marketView === "my_items" && (
                        <span className="ml-1.5 bg-white bg-opacity-30 text-xs font-normal rounded-full px-1.5 py-0.5">
                          {
                            filteredMarketItems.filter((item) =>
                              filterKey === "all" ? true : item.status === filterKey
                            ).length
                          }
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </div>
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
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sản phẩm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giá
                        </th>
                        {marketView === "my_items" && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Người bán
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày đăng
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                  statusColors[item.status] || statusColors.draft
                                }`}
                              >
                                {statusConfig[item.status]?.name || statusConfig.draft.name}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.seller}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.createdAt && new Date(item.createdAt).toLocaleDateString()}
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
                                    onClick={() => handleDeleteItem(item.id)}
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
                filteredMarketItems.map((item) => (
                  <MarketplaceItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onPurchase={handlePurchase}
                    showDetailedStatus={marketView === "my_items"}
                    viewMode={marketView}
                    fetchItems={() => console.log("Refreshing items")}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
      {selectedItem && (
        <>
          <PurchaseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            item={selectedItem}
            userCoins={userCoins}
            onConfirm={confirmPurchase}
          />
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
                <h3 className="font-medium text-gray-700 mb-1">Thông tin sản phẩm</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Số lượng còn lại:</div>
                  <div className="text-gray-700 font-medium">
                    {selectedItem.stock || "Không xác định"}
                  </div>
                  <div className="text-gray-500">Tình trạng:</div>
                  <div className="text-gray-700 font-medium">
                    {selectedItem.condition === "used" ? "Cũ" : "Mới"}
                  </div>
                  <div className="text-gray-500">Người bán:</div>
                  <div className="text-gray-700 font-medium">{selectedItem.seller}</div>
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
    </div>
  );
}

export default ItemCatalog;