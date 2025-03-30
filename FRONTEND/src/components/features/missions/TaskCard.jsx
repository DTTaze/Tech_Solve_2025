import React from "react";
import ProgressBar from "./ProgressBar";
import { getLevelColor, getLevelText } from "./TaskUtils";
import images from "../../features/exchangemarket/Photo.jsx";

/**
 * Task Card component for displaying mission tasks
 * @param {Object} props
 * @param {Object} props.task - Task data object
 * @param {Function} props.onClick - Function to handle task completion
 * @param {number|null} props.completingTask - ID of the task currently being completed (for loading state)
 */
const TaskCard = React.memo(({ task, onClick, completingTask }) => {
  const isCompleted = task.Complete === task.Total;
  const levelColorClass = getLevelColor(task.level);
  const isLoading = completingTask === task.task_id;
  
  return (
    <div 
      className={`task-card bg-white rounded-xl border ${
        isCompleted ? 'border-emerald-200 shadow-emerald-100' : 'border-gray-200'
      } shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group hover:translate-y-[-2px] ${isLoading ? 'opacity-70' : ''}`}
    >
      {/* Difficulty badge at top */}
      <div className={`w-full h-1.5 ${levelColorClass.split(' ')[0]}`}></div>
      
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border p-1 bg-gray-50 
            ${isCompleted ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'}`}>
            <img src={task.imgScr} alt="task icon" className="w-full h-full" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-sm">{task.Task_num}</h3>
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full text-white ${levelColorClass}`}>
              {getLevelText(task.level)}
            </span>
          </div>
          <div className="task-coin-reward flex items-center bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-lg font-medium border border-amber-100 text-xs">
            <span className="coin-value">+{task.coin || 0}</span>
            <img src={images.coin} alt="coin" className="w-3 h-3 ml-1" />
          </div>
        </div>
        
        <p className="text-gray-600 text-xs mb-2 line-clamp-2 min-h-[32px]">
          {task.description || "Mô tả nhiệm vụ đang được cập nhật..."}
        </p>
        
        <ProgressBar completed={task.Complete} total={task.Total} level={task.level} />
        
        <button
          onClick={isLoading ? null : onClick}
          disabled={task.completed_at || isLoading}
          className={`w-full mt-3 rounded-lg py-1.5 text-sm font-medium text-white transition-colors ${
            isCompleted 
              ? 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700' 
              : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
          } ${(task.completed_at || isLoading) ? 'opacity-50 cursor-not-allowed' : ''} 
          focus:outline-none focus:ring-2 ${isCompleted ? 'focus:ring-emerald-500' : 'focus:ring-green-500'} focus:ring-opacity-50`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          ) : task.completed_at 
            ? '✓ Đã hoàn thành' 
            : isCompleted 
              ? 'Nhận thưởng' 
              : 'Thực hiện'
          }
        </button>
      </div>
    </div>
  );
});

export default TaskCard;
