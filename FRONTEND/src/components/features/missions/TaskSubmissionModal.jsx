import React, { useState } from "react";
import { X } from "lucide-react";

export default function TaskSubmissionModal({
  isOpen,
  onClose,
  task,
  handleTaskCompletion,
  userID,
}) {
  const [files, setFiles] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleConfirm = () => {
    const fileCount = files.length;
    const numOfFileRemaining = task.total - task.progress_count;
    const maxProgress = Math.min(fileCount, numOfFileRemaining);
    handleTaskCompletion(userID, task.id, maxProgress);
    setFiles([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50 p-4">
      <div className="bg-green-50 p-6 rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl border border-green-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800">
            Thông tin nhiệm vụ
          </h2>
          <button
            onClick={onClose}
            className="text-green-700 hover:text-green-900"
          >
            <X className="h-7 w-7 sm:h-8 sm:w-8" />
          </button>
        </div>

        {/* Nhiệm vụ chi tiết */}
        <div className="space-y-2 text-[1.1rem] sm:text-lg text-green-700">
          <p>
            <strong>Nhiệm vụ:</strong> {task.title}
          </p>
          <p>
            <strong>Mô tả:</strong> {task.description}
          </p>
          <p>
            <strong>Tiền thưởng:</strong> {task.coins} <span className="inline-block">🪙</span>
          </p>
          <p>
            <strong>Tiến độ tối đa:</strong> {task.total}
          </p>
        </div>

        {/* Upload ảnh */}
        <div className="mt-6">
          <label className="block text-base font-medium text-green-800 mb-3">
            Tải lên bằng chứng (ảnh):
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-base text-green-700 bg-white border border-green-300 rounded-xl px-4 py-2 cursor-pointer
            file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition"
          />

          {/* Info về file đã chọn */}
          {files.length > 0 && (
            <div className="mt-3 space-y-1 text-green-600 text-sm sm:text-base">
              <p>📸 Đã chọn {files.length} ảnh.</p>
              <p>
                Tiến độ tăng thêm:{" "}
                <strong>
                  {Math.min(files.length, task.total)}/{task.total}
                </strong>
              </p>
            </div>
          )}
        </div>

        {/* Nút xác nhận */}
        <div className="flex justify-end mt-8">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
            onClick={() => handleConfirm(Math.min(files.length, task.total))}
            disabled={files.length === 0}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
