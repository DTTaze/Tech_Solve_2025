import { useState } from "react";
import {
  Edit2,
  Trash2,
  User,
  ExternalLink,
  AlertTriangle,
  Coins,
  Tag,
  EyeOff,
  FileWarning,
  Clock,
  ClipboardEdit,
  CheckCircle,
} from "lucide-react";

// Status definitions
const statusConfig = {
  displaying: { name: "Đang hiển thị", color: "emerald", Icon: CheckCircle },
  pending: { name: "Chờ duyệt", color: "amber", Icon: Clock },
  rejected: { name: "Bị từ chối", color: "red", Icon: FileWarning },
  hidden: { name: "Đã ẩn", color: "gray", Icon: EyeOff },
  draft: { name: "Tin nháp", color: "slate", Icon: ClipboardEdit },
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

export default function MarketplaceItemCard({ item, onEdit, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handleEditClick = () => {
    onEdit(item);
  };

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    onDelete(item.id);
    setShowConfirmDelete(false);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
  };

  const currentStatus = statusConfig[item.status] || statusConfig.draft; // Default to draft if status is unknown

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="h-full w-full object-cover"
        />

        {/* Status tag */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center 
            bg-${currentStatus.color}-100 text-${currentStatus.color}-600`}
        >
          <currentStatus.Icon className="h-3 w-3 mr-1" />
          {currentStatus.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow">
        {/* Category */}
        <div className="mb-2 flex items-center">
          <Tag className="h-3 w-3 mr-1 text-sky-600" />
          <span className="text-xs font-medium text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
            {getCategoryDisplayName(item.category)}
          </span>
        </div>

        <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {item.description}
        </p>

        <div className="flex items-center mt-3">
          <Coins className="h-4 w-4 text-emerald-600 mr-1" />
          <span className="font-semibold text-emerald-600">{item.price}</span>
          <span className="ml-1 text-gray-600 text-sm">coins</span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mt-3">
          <User className="h-3 w-3 mr-1" />
          <span>{item.viewCount || 0} lượt xem</span>
          {item.status === "displaying" && (
            <span className="ml-auto bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-xs font-medium">
              Còn {item.stock} sản phẩm
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-gray-100">
        {!showConfirmDelete ? (
          <div className="flex justify-between">
            <button
              onClick={handleEditClick}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center text-red-600 mb-2">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Xác nhận xóa?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-1 rounded-md"
              >
                Xóa
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium py-1 rounded-md"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
