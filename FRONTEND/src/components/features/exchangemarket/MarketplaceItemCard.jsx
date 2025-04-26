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
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import DeleteConfirmModal from "../../common/DeleteConfirmModal";
import PurchaseModal from "./PurchaseModal";
import {
  Paper,
  Box,
  Chip,
  Typography,
  IconButton,
  Tooltip,
  Button,
  Modal,
} from "@mui/material";
import { format } from "date-fns";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Status definitions
const statusConfig = {
  public: { name: "Đang hiển thị", color: "emerald", Icon: CheckCircle },
  private: { name: "Đã ẩn", color: "gray", Icon: EyeOff },
  pending: { name: "Chờ duyệt", color: "amber", Icon: Clock },
  rejected: { name: "Bị từ chối", color: "red", Icon: FileWarning },
};

// Helper function to get status class
const getStatusClass = (status) => {
  const statusClasses = {
    public: "border-emerald-200 bg-emerald-50",
    private: "border-gray-200 bg-gray-50",
    pending: "border-amber-200 bg-amber-50",
    rejected: "border-red-200 bg-red-50",
  };
  return statusClasses[status] || statusClasses.draft;
};

// Helper function to get status text
const getStatusText = (status) => {
  return statusConfig[status]?.name || statusConfig.draft.name;
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

  const currentStatus = statusConfig[item.status] || statusConfig.draft; // Default to draft if status is unknown

  return (
    <Paper
      className={`rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${getStatusClass(
        item.status
      )}`}
    >
      {/* Item Image */}
      <div className="relative mb-3 h-48 w-full overflow-hidden rounded-md">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="h-full w-full object-cover"
        />
        {viewMode === "my_items" && (
          <div className="absolute top-2 right-2 rounded-full bg-white px-2 py-1 text-xs font-medium">
            {getStatusText(item.status)}
          </div>
        )}
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

      {/* Card footer with actions */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            label={statusConfig[item.status].name}
            color={statusConfig[item.status].color}
            size="small"
            sx={{ mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {item.createdAt && format(new Date(item.createdAt), "dd/MM/yyyy")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: { xs: 1, sm: 0 } }}>
          {viewMode === "my_items" ? (
            <>
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size="small"
                  onClick={() => onEdit(item)}
                  color="primary"
                >
                  <FiEdit className="mr-1" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  color="error"
                >
                  <FiTrash2 className="mr-1" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={handleViewDetails}
                sx={{ mr: 1 }}
              >
                Xem chi tiết
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<ShoppingCartIcon />}
                onClick={handlePurchaseClick}
                disabled={!item.canPurchase}
              >
                Mua
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
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
      <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Chi tiết sản phẩm
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <img
              src={item.image || "/placeholder-image.jpg"}
              alt={item.name}
              style={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />

            <Typography variant="h5" gutterBottom>
              {item.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                color="primary.main"
                fontWeight="bold"
              >
                {item.price} điểm
              </Typography>
              <Chip
                label={getCategoryDisplayName(item.category)}
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>

            <Typography variant="body1">{item.description}</Typography>

            <Typography variant="body2" color="text.secondary">
              Người đăng: {item.userName || "Người dùng hệ thống"}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Ngày đăng:{" "}
              {item.createdAt && format(new Date(item.createdAt), "dd/MM/yyyy")}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setShowDetailsModal(false)}
              >
                Đóng
              </Button>
              <Button
                variant="contained"
                startIcon={<ShoppingCartIcon />}
                onClick={() => {
                  setShowDetailsModal(false);
                  handlePurchaseClick();
                }}
                disabled={!item.canPurchase}
              >
                Mua
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Paper>
  );
};

export default MarketplaceItemCard;
