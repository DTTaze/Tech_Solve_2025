import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10 mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            {title || "Xác nhận xóa"}
          </h3>
        </div>

        <p className="mb-6 text-gray-600">
          {message ||
            "Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."}
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
