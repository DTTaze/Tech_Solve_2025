import { useState, useEffect, useCallback, useMemo } from "react";
import { getUserApi, purchaseItemApi, createProductApi, updateProductApi, getProductByIdUser, getAllProductsApi, getAllItemsApi } from "../../../utils/api";
import CatalogHeader from "./CatalogHeader";
import TabsNavigation from "./TabsNavigation";
import SearchFilterBar from "./SearchFilterBar";
import RedeemTab from "./RedeemTab";
import MarketViewNavigation from "./MarketViewNavigation";
import CreateItemModal from "./CreateItemModal";
import PurchaseModal from "./PurchaseModal";
import MarketSearchBar from "./MarketSearchBar";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketEmptyState from "./MarketEmptyState";
import { Filter, CheckCircle, Clock, FileWarning, EyeOff, ClipboardEdit } from "lucide-react";

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
          // console.log(itemsResponse);
          if (itemsResponse && itemsResponse.data) {
            const mappedItems = itemsResponse.data.map((item) => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              category: item.category,
              postStatus: item.post_status,
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
            console.log(productResponse);
            if (productResponse && productResponse.data) {
              const mappedMyItems = productResponse.data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                postStatus: item.post_status,
                condition: item.product_status,
                createdAt: item.created_at,
                image: item.images.length > 0 ? item.images[0] : null,
                stock: item.stock || null,
                canPurchase: item.post_status === "public",
                seller: item.seller_id || "Không xác định",
              }));
              setMyItems(mappedMyItems);
            }
          }

          if (marketView !== "my_items") {
            const allProductsResponse = await getAllProductsApi();
            if (allProductsResponse && allProductsResponse.data) {
              const mappedAllItems = allProductsResponse.data.map((item) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                postStatus: item.post_status,
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

  const handleSubmitItem = async (formData, isEditing) => {
    try {
      const { images, ...productData } = formData;
      if (
        !productData.name ||
        !productData.price ||
        !productData.stock ||
        !productData.category ||
        !productData.product_status
      ) {
        alert("Vui lòng điền đầy đủ các trường bắt buộc: tên, giá, số lượng, danh mục, tình trạng sản phẩm!");
        return;
      }

      if (productData.price < 1) {
        alert("Giá sản phẩm phải lớn hơn hoặc bằng 1!");
        return;
      }

      if (productData.stock < 1) {
        alert("Số lượng sản phẩm phải lớn hơn hoặc bằng 1!");
        return;
      }

      if (isEditing) {
        const response = await updateProductApi(itemToEdit.id, productData, images || []);
        if (response) {
          setMyItems((prev) =>
            prev.map((item) =>
              item.id === itemToEdit.id
                ? {
                    ...item,
                    ...productData,
                    postStatus: response.post_status || item.postStatus,
                    image: response.images?.[0] || item.image,
                    createdAt: response.created_at || item.createdAt,
                    stock: response.stock || item.stock,
                    canPurchase: response.post_status === "public",
                  }
                : item
            )
          );
          alert("Cập nhật sản phẩm thành công!");
        } else {
          alert("Cập nhật sản phẩm thất bại, vui lòng thử lại!");
        }
      } else {
        const response = await createProductApi(productData, user?.id, images || []);
        if (response) {
          const newItem = {
            id: response.data.id,
            ...productData,
            postStatus: response.data.post_status || "draft",
            image: response.data.images?.[0] || null,
            createdAt: response.data.created_at || new Date().toISOString(),
            stock: response.data.stock || null,
            canPurchase: response.data.post_status === "public",
            seller: user?.username || "Không xác định",
          };
          setMyItems((prev) => [...prev, newItem]);
          alert("Thêm sản phẩm mới thành công!");
        } else {
          alert("Thêm sản phẩm thất bại, vui lòng thử lại!");
        }
      }
      setShowCreateModal(false);
      setItemToEdit(null);
    } catch (error) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
      alert(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
    }
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
        filtered = filtered.filter((item) => item.postStatus === marketStatusFilter);
      }
    } else {
      filtered = filtered.filter((item) => item.postStatus === "public");
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
            <MarketSearchBar
              marketSearchText={marketSearchText}
              setMarketSearchText={setMarketSearchText}
              marketListView={marketListView}
              setMarketListView={setMarketListView}
            />
            <MarketFilterButtons
              marketView={marketView}
              marketCategory={marketCategory}
              setMarketCategory={setMarketCategory}
              marketStatusFilter={marketStatusFilter}
              setMarketStatusFilter={setMarketStatusFilter}
              filteredMarketItems={filteredMarketItems}
              marketplaceCategories={marketplaceCategories}
              userItemStatuses={userItemStatuses}
              statusColors={statusColors}
            />
          </div>
          {filteredMarketItems.length === 0 ? (
            <MarketEmptyState
              marketView={marketView}
              marketStatusFilter={marketStatusFilter}
              handleAddItem={handleAddItem}
            />
          ) : (
            <MarketItemList
              marketListView={marketListView}
              marketView={marketView}
              filteredMarketItems={filteredMarketItems}
              handleEditItem={handleEditItem}
              handleDeleteItem={handleDeleteItem}
              handlePurchase={handlePurchase}
              getCategoryDisplayName={getCategoryDisplayName}
              statusColors={statusColors}
              statusConfig={statusConfig}
            />
          )}
        </div>
      )}
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

export default ItemCatalog;