import React from "react";
import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";
import imgSrc from "../../../assets/images/seedling-solid.svg";

/**
 * Component to display a list of tasks with pagination
 */
const TasksList = ({
  tasks,
  loading,
  completingTask,
  handleTaskCompletion,
  currentPage,
  totalPages,
  goToNextPage,
  goToPreviousPage,
  userId,
  selectedTab,
  taskPerPage,
}) => {
  console.log("tasks in TaskList: ",tasks);
  if (loading) {
    return (
      <>
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </>
    );
  }

  if (selectedTab === "daily") {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-700 p-1.5 rounded-full mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
              />
            </svg>
          </span>
          Nhiệm Vụ Hôm Nay
        </h2>

        {tasks && tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {tasks.map(
              (task) =>
                task && (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleTaskCompletion(userId, task.id)}
                    completingTask={completingTask}
                  />
                )
            )}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-blue-50 rounded-xl">
            <img
              src={imgSrc}
              alt="All done!"
              className="w-20 h-20 mx-auto mb-4 opacity-30"
            />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Tuyệt vời!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-4">
              Bạn đã hoàn thành tất cả nhiệm vụ hôm nay. Hãy quay lại vào ngày
              mai để tiếp tục chuỗi hoạt động!
            </p>
          </div>
        )}
      </div>
    );
  } else if (selectedTab === "other") {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-indigo-100 text-indigo-700 p-1.5 rounded-full mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </span>
          Nhiệm Vụ Khác
        </h2>

        {tasks && tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {tasks
              .slice(
                (currentPage - 1) * (taskPerPage || 3),
                currentPage * (taskPerPage || 3)
              )
              .map(
                (task) =>
                  task && (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => handleTaskCompletion(userId, task.id)}
                      completingTask={completingTask}
                    />
                  )
              )}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-indigo-50 rounded-xl">
            <img
              src={imgSrc}
              alt="No tasks"
              className="w-20 h-20 mx-auto mb-4 opacity-30"
            />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Chưa có nhiệm vụ!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Hiện tại chưa có nhiệm vụ khác nào. Hãy hoàn thành nhiệm vụ hàng
              ngày trước nhé!
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {tasks && tasks.length > (taskPerPage || 3) && (
          <div className="pagination flex justify-center items-center mt-8 gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`pagination-button h-10 w-10 rounded-full flex items-center justify-center ${
                currentPage === 1
                  ? "text-gray-400 bg-gray-100"
                  : "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              }`}
            >
              &lt;
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`pagination-button h-10 w-10 rounded-full flex items-center justify-center ${
                currentPage === totalPages
                  ? "text-gray-400 bg-gray-100"
                  : "text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              }`}
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    );
  } else if (selectedTab === "completed") {
    // For the completed section
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="bg-green-100 text-green-700 p-1.5 rounded-full mr-2">
            <svg
              xmlns={imgSrc}
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
          Nhiệm Vụ Đã Hoàn Thành ({tasks ? tasks.length : 0})
        </h2>

        {tasks && tasks.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {tasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="bg-gray-50 rounded-xl border border-gray-200 p-4 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border border-green-200 bg-green-50">
                    <img
                      src={imgSrc}
                      alt="task icon"
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700 flex items-center">
                      {task.tasks.title}
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Hoàn thành
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Hoàn thành:{" "}
                      {new Date(task.completed_at).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-green-50 rounded-xl">
            <img
              src={imgSrc}
              alt="No tasks"
              className="w-20 h-20 mx-auto mb-4 opacity-30"
            />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Chưa có nhiệm vụ hoàn thành!
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Bạn chưa hoàn thành nhiệm vụ nào. Hãy bắt đầu với nhiệm vụ hàng
              ngày.
            </p>
          </div>
        )}

        {tasks && tasks.length > 4 && (
          <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg">
            Xem tất cả {tasks.length} nhiệm vụ đã hoàn thành
          </button>
        )}
      </div>
    );
  }

  return null;
};

export default TasksList;
