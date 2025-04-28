import { useState } from "react";
import {
  CheckCircle,
  EyeOff,
  Clock,
  FileWarning,
  ClipboardEdit,
  Eye, 
} from "lucide-react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import PurchaseModal from "./PurchaseModal";
import { format } from "date-fns";

const statusConfig = {
  public: { name: "Đang hiển thị", color: "text-green-600", Icon: CheckCircle },
  private: { name: "Đã ẩn", color: "text-gray-600", Icon: EyeOff },
  pending: { name: "Chờ duyệt", color: "text-yellow-600", Icon: Clock },
  rejected: { name: "Bị từ chối", color: "text-red-600", Icon: FileWarning },
  draft: { name: "Tin nháp", color: "text-blue-600", Icon: ClipboardEdit },
};

const getStatusClass = (status) => {
  const statusClasses = {
    public: "border-emerald-200 bg-emerald-50",
    private: "border-gray-200 bg-gray-50",
    pending: "border-amber-200 bg-amber-50",
    rejected: "border-red-200 bg-red-50",
    draft: "border-slate-200 bg-slate-50",
  };
  return statusClasses[status] || statusClasses.draft;
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

  const handleEditClick = () => {
    onEdit(item);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handlePurchaseClick = () => {
    if (onPurchase) {
      onPurchase(item);
    } else {
      setShowPurchaseModal(true);
    }
  };

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  const currentStatus = statusConfig[item.postStatus] || statusConfig.draft;

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${getStatusClass(
        item.postStatus
      )}`}
    >
      {/* Item Image */}
      <div className="relative mb-3 h-48 w-full overflow-hidden rounded-md">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">
          {getCategoryDisplayName(item.category)}
        </p>
        <p className="mt-1 text-sm text-gray-700 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-2 flex items-center">
          <span className="font-medium text-amber-600">{item.price}</span>
          <img
            src="/assets/icons/coin.png"
            alt="coins"
            className="ml-1 h-5 w-5"
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`text-xs font-semibold px-2 py-1 rounded ${currentStatus.color} bg-gray-100`}>
            {currentStatus.name}
          </div>
          <span className="text-xs text-gray-500">
            {item.createdAt && format(new Date(item.createdAt), "dd/MM/yyyy")}
          </span>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          {viewMode === "my_items" ? (
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
          ) : (
            <button
              onClick={handleViewDetails}
              className="flex mt-5 items-center gap-1 border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100"
            >
              <Eye size={16} />
              Xem chi tiết
            </button>
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
          onSuccess={() => {
            if (fetchItems) fetchItems();
          }}
        />
      )}

      {/* Details modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h2>

            <div className="flex flex-col gap-2">
              <img
                src={item.image || "/placeholder-image.jpg"}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />

              <h3 className="text-lg font-bold">{item.name}</h3>

              <div className="flex justify-between items-center">
                <span className="text-primary font-semibold">
                  {item.price} điểm
                </span>
                <div className="text-xs border px-2 py-1 rounded text-primary">
                  {getCategoryDisplayName(item.category)}
                </div>
              </div>

              <p className="text-gray-700">{item.description}</p>

              <p className="text-sm text-gray-500">
                Người đăng: {item.seller || "Người dùng hệ thống"}
              </p>

              <p className="text-sm text-gray-500">
                Ngày đăng: {item.createdAt && format(new Date(item.createdAt), "dd/MM/yyyy")}
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="border px-4 py-2 rounded hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceItemCard;