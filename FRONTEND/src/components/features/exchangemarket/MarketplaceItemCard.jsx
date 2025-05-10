import { useState, useContext } from "react";
import { CheckCircle, EyeOff, Clock, FileWarning, ClipboardEdit, Eye, Coins } from "lucide-react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import PurchaseModal from "./PurchaseModal";
import DetailsModal from "./DetailsModal";
import { AuthContext } from "../../../contexts/auth.context";
import { MarketplaceContext } from "../../../pages/ExchangeMarket";

export const statusConfig = {
  public: { name: "Đang hiển thị", color: "text-green-600", Icon: CheckCircle },
  private: { name: "Đã ẩn", color: "text-gray-600", Icon: EyeOff },
  pending: { name: "Chờ duyệt", color: "text-yellow-600", Icon: Clock },
  rejected: { name: "Bị từ chối", color: "text-red-600", Icon: FileWarning },
  draft: { name: "Tin nháp", color: "text-blue-600", Icon: ClipboardEdit },
};

export const getStatusClass = (status) => {
  const statusClasses = {
    public: "border-emerald-200 bg-emerald-50",
    private: "border-gray-200 bg-gray-50",
    pending: "border-amber-200 bg-amber-50",
    rejected: "border-red-200 bg-red-50",
    draft: "border-slate-200 bg-slate-50",
  };
  return statusClasses[status] || statusClasses.draft;
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

const MarketplaceItemCard = ({
  item,
  onEdit,
  onDelete,
  onPurchase,
  viewMode = "all_items",
  fetchItems,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { auth } = useContext(AuthContext);
  const { confirmPurchase, handlePurchase } = useContext(MarketplaceContext);

  const handleEditClick = () => {
    setShowDetailsModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteModal(false);
    if (fetchItems) fetchItems();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDetailsClick = () => {
    if (viewMode === "redeem") {
      if (!auth.user) {
        alert("Vui lòng đăng nhập để thực hiện giao dịch!");
        return;
      }
      handlePurchase(item); // Gọi handlePurchase để thiết lập selectedItem
      setShowPurchaseModal(true);
    } else {
      setShowDetailsModal(true);
    }
  };

  return (
    <div
      className={`relative rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${getStatusClass(
        item.postStatus
      )} group`}
    >
      {/* Item Image */}
      <div
        className={`relative mb-3 h-48 w-full overflow-hidden rounded-md transition-all duration-200 ${
          viewMode === "all_items" || viewMode === "redeem" ? "group-hover:blur-sm" : ""
        } ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}
      >
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div
        className={`mb-4 transition-all duration-200 ${
          viewMode === "all_items" || viewMode === "redeem" ? "group-hover:blur-sm" : ""
        } ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}
      >
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">
          {getCategoryDisplayName(item.category)}
        </p>
        <p className="mt-1 text-sm text-gray-700 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-2 flex items-center">
          <span className="font-medium text-amber-600">{item.price}</span>
          <Coins className="ml-1 h-5 w-5 text-amber-600" />
        </div>
      </div>

      {/* Action Button */}
      {(viewMode === "all_items" || viewMode === "redeem") && (
        <button
          onClick={handleDetailsClick}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center rounded-md gap-1 border border-gray-300 p-3 text-sm bg-white hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        >
          <Eye size={16} />
          {viewMode === "redeem" ? "Mua" : "Xem chi tiết"}
        </button>
      )}

      {/* Edit/Delete Buttons */}
      <div
        className={`mt-2 flex flex-wrap justify-between items-center transition-all duration-200 ${
          viewMode === "all_items" || viewMode === "redeem" ? "group-hover:blur-sm" : ""
        } ${showPurchaseModal || showDetailsModal ? "blur-sm" : ""}`}
      >
        <div className="flex gap-2 mt-2 sm:mt-0">
          {viewMode === "my_items" && (
            <>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <FiEdit />
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
              >
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Xóa sản phẩm"
          message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        />
      )}

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          item={item}
          userCoins={auth.user?.coins?.amount || 0}
          onConfirm={(quantity, shippingInfo) => {
            confirmPurchase(quantity, shippingInfo);
            setShowPurchaseModal(false);
            if (fetchItems) fetchItems();
          }}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <DetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          item={item}
          getCategoryDisplayName={getCategoryDisplayName}
          isEditMode={viewMode === "my_items"}
          onEdit={onEdit}
          onPurchase={() => {
            setShowDetailsModal(false);
            setShowPurchaseModal(true);
          }}
          fetchItems={fetchItems}
        />
      )}
    </div>
  );
};

export default MarketplaceItemCard;