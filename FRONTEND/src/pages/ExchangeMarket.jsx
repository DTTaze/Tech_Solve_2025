import {
  useEffect,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  getUserApi,
  purchaseItemApi,
  createProductApi,
  updateProductApi,
  getProductByIdUser,
  getAllAvailableProductsApi,
  getAllItemsApi,
} from "../utils/api";
import { AuthContext } from "../contexts/auth.context";
import ItemCatalogSkeleton from "../components/features/exchangemarket/ItemCatalogSkeleton";
import CatalogHeader from "../components/features/exchangemarket/CatalogHeader";
import MarketViewNavigation from "../components/features/exchangemarket/MarketViewNavigation";
import RedeemTab from "../components/features/exchangemarket/RedeemTab";
import UserItemsTab from "../components/features/exchangemarket/UserItemsTab";
import AllItemsTab from "../components/features/exchangemarket/AllItemsTab";
import PurchaseModal from "../components/features/exchangemarket/PurchaseModal";
import {
  Filter,
  CheckCircle,
  Clock,
  FileWarning,
  EyeOff,
  ClipboardEdit,
} from "lucide-react";

export const marketplaceCategories = [
  { key: "all", name: "Tất cả" },
  { key: "recycled", name: "Đồ tái chế" },
  { key: "handicraft", name: "Đồ thủ công" },
  { key: "organic", name: "Sản phẩm hữu cơ" },
  { key: "plants", name: "Cây trồng" },
  { key: "other", name: "Khác" },
];

export const statusColors = {
  displaying: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
  hidden: "bg-gray-100 text-gray-700",
  draft: "bg-slate-100 text-slate-700",
  all: "bg-blue-100 text-blue-700",
  public: "bg-emerald-100 text-emerald-700",
};

export const userItemStatuses = [
  { key: "all", name: "Tất cả", icon: Filter },
  { key: "public", name: "Đang hiển thị", icon: CheckCircle },
  { key: "pending", name: "Chờ duyệt", icon: Clock },
  { key: "rejected", name: "Bị từ chối", icon: FileWarning },
  { key: "hidden", name: "Đã ẩn", icon: EyeOff },
  { key: "draft", name: "Tin nháp", icon: ClipboardEdit },
];

export const statusConfig = {
  public: { name: "Đang hiển thị", color: "emerald" },
  pending: { name: "Chờ duyệt", color: "amber" },
  rejected: { name: "Bị từ chối", color: "red" },
  hidden: { name: "Đã ẩn", color: "gray" },
  draft: { name: "Tin nháp", color: "slate" },
};

export const getCategoryDisplayName = (key) => {
  const categories = {
    handicraft: "Đồ thủ công",
    recycled: "Đồ tái chế",
    organic: "Sản phẩm hữu cơ",
    plants: "Cây trồng",
    other: "Khác",
  };
  return categories[key] || "Không xác định";
};

export const MarketplaceContext = createContext();

export default function ExchangeMarket() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [marketListView, setMarketListView] = useState("grid");
  const [marketCategory, setMarketCategory] = useState("all");
  const [marketStatusFilter, setMarketStatusFilter] = useState("all");
  const [marketSearchText, setMarketSearchText] = useState("");

  useEffect(() => {
    async function initialize() {
      try {
        const userResponse = await getUserApi();
        if (!userResponse.success) {
          throw new Error("Không thể tải dữ liệu người dùng");
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  const fetchRedeemItems = useCallback(async () => {
    try {
      const itemsResponse = await getAllItemsApi();
      if (itemsResponse?.data) {
        const mappedItems = itemsResponse.data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          postStatus: item.status === "available" ? "public" : item.status,
          condition: item.product_status || "new",
          createdAt: item.created_at,
          image: item.images.length > 0 ? item.images[0] : null,
          stock: item.stock || 0,
          canPurchase: item.status === "available",
          seller: item.creator?.username || "Không xác định",
          purchaseLimitPerDay: item.purchase_limit_per_day,
        }));
        setItems(mappedItems);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm cho tab đổi quà:", error);
      alert(
        "Có lỗi xảy ra khi tải danh sách sản phẩm đổi quà, vui lòng thử lại sau!"
      );
    }
  }, []);

  const fetchMyItems = useCallback(async () => {
    if (!auth.user?.id) return;
    try {
      const productResponse = await getProductByIdUser(auth.user.id);
      if (productResponse?.data) {
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
          stock: item.stock || 0,
          canPurchase: item.post_status === "public",
          seller: item.seller_id || "Không xác định",
          purchaseLimitPerDay: item.purchase_limit_per_day,
        }));
        setMyItems(mappedMyItems);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm của người dùng:", error);
      alert(
        "Có lỗi xảy ra khi tải danh sách sản phẩm của bạn, vui lòng thử lại sau!"
      );
    }
  }, [auth.user?.id]);

  const fetchAllItems = useCallback(async () => {
    try {
      const allProductsResponse = await getAllAvailableProductsApi();
      if (allProductsResponse?.data) {
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
          stock: 0,
          canPurchase: item.post_status === "public",
          seller: item.seller?.username || "Không xác định",
          purchaseLimitPerDay: null,
        }));
        setAllItems(mappedAllItems);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tất cả sản phẩm:", error);
      alert(
        "Có lỗi xảy ra khi tải danh sách sản phẩm chợ trao đổi, vui lòng thử lại sau!"
      );
    }
  }, []);

  const handlePurchase = useCallback(
    (item) => {
      const userCoins = auth.user?.coins?.amount || 0;
      if (!item) {
        alert("Mặt hàng không hợp lệ!");
        return;
      }
      if (userCoins < item.price) {
        alert("Bạn không có đủ số coins để giao dịch!");
        return;
      }
      setSelectedItem(item);
      setIsModalOpen(true);
    },
    [auth.user?.coins?.amount]
  );

  const confirmPurchase = useCallback(
    async (quantity) => {
      if (!selectedItem || !auth.user) return;
      const userCoins = auth.user.coins?.amount || 0;
      const totalCost = selectedItem.price * quantity;
      if (userCoins < totalCost) {
        alert("Bạn không có đủ số coins để giao dịch!");
        return;
      }
      try {
        const response = await purchaseItemApi(auth.user.id, selectedItem.id, {
          name: selectedItem.name,
          quantity: quantity,
        });
        if (response.data) {
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
    [selectedItem, auth.user]
  );

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
        alert(
          "Vui lòng điền đầy đủ các trường bắt buộc: tên, giá, số lượng, danh mục, tình trạng sản phẩm!"
        );
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
        const response = await updateProductApi(
          itemToEdit.id,
          productData,
          images || []
        );
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
                    purchaseLimitPerDay: response.purchase_limit_per_day,
                  }
                : item
            )
          );
          alert("Cập nhật sản phẩm thành công!");
        } else {
          alert("Cập nhật sản phẩm thất bại, vui lòng thử lại!");
        }
      } else {
        const response = await createProductApi(
          productData,
          auth.user?.id,
          images || []
        );
        if (response) {
          const newItem = {
            id: response.data.id,
            ...productData,
            postStatus: response.data.post_status || "draft",
            image: response.data.images?.[0] || null,
            createdAt: response.data.created_at || new Date().toISOString(),
            stock: response.data.stock || null,
            canPurchase: response.data.post_status === "public",
            seller: auth.user?.username || "Không xác định",
            purchaseLimitPerDay: response.data.purchase_limit_per_day,
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

  const contextValue = {
    items,
    myItems,
    allItems,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    isFilterOpen,
    setIsFilterOpen,
    marketListView,
    setMarketListView,
    marketCategory,
    setMarketCategory,
    marketStatusFilter,
    setMarketStatusFilter,
    marketSearchText,
    setMarketSearchText,
    showCreateModal,
    setShowCreateModal,
    itemToEdit,
    setItemToEdit,
    handlePurchase,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSubmitItem,
    handleCancelForm,
  };

  if (loading) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <ItemCatalogSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Lỗi đã xảy ra
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceContext.Provider value={contextValue}>
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
          <CatalogHeader userCoins={auth.user?.coins?.amount || 0} />
          <MarketViewNavigation />
          <div className="flex flex-col bg-white rounded-lg shadow-sm p-4">
            <Routes>
              <Route
                path="redeem"
                element={<RedeemTab fetchItems={fetchRedeemItems} />}
              />
              <Route
                path="my-items"
                element={<UserItemsTab fetchItems={fetchMyItems} />}
              />
              <Route
                path="all-items"
                element={<AllItemsTab fetchItems={fetchAllItems} />}
              />
              <Route path="/" element={<Navigate to="redeem" replace />} />
            </Routes>
            {selectedItem && (
              <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
                userCoins={auth.user?.coins?.amount || 0}
                onConfirm={confirmPurchase}
              />
            )}
          </div>
        </main>
      </MarketplaceContext.Provider>
    </div>
  );
}
