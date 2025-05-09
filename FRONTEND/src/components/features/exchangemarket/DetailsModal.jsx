import { format } from "date-fns";

const DetailsModal = ({ isOpen, onClose, item, getCategoryDisplayName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md mx-auto shadow-2xl transform transition-all">
        <h2 className="text-xl font-semibold mb-4 text-left">
          Chi tiết sản phẩm
        </h2>

        <div className="flex flex-col gap-4">
          <img
            src={item.image || "/placeholder-image.jpg"}
            alt={item.name}
            className="w-full h-48 object-cover rounded text-left"
          />

          <h3 className="text-lg font-bold text-left">{item.name}</h3>

          <div className="flex justify-between items-center">
            <span className="text-indigo-600 font-semibold">
              {item.price} điểm
            </span>
            <div className="text-xs border px-2 py-1 rounded text-indigo-600">
              {getCategoryDisplayName(item.category)}
            </div>
          </div>

          <p className="text-gray-700 text-left">{item.description}</p>

          <p className="text-sm text-gray-500 text-left">
            Người đăng: {item.seller || "Người dùng hệ thống"}
          </p>

          <p className="text-sm text-gray-500 text-left">
            Ngày đăng:{" "}
            {item.createdAt && format(new Date(item.createdAt), "dd/MM/yyyy")}
          </p>
        </div>

        <div className="flex justify-begin gap-2 mt-6">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
