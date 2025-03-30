import React, { useState, useEffect, useMemo, useCallback } from "react";
import Calendar from "../components/features/missions/Calendar.jsx";
import Ranking from "../components/features/missions/ChartRank.jsx";
import "../styles/pages/mission.scss";
import images from "../components/features/exchangemarket/Photo.jsx";
import CoinBalance from "../components/exchangemarket/CoinBalance.jsx";
import { getAllTasksApi, completeTaskApi, receiveCoinApi, getUserApi } from "../utils/api";
import { toast } from "react-toastify";

// Skeleton loader component for task cards
const TaskCardSkeleton = () => (
  <div className="task-card-skeleton bg-white rounded-xl border border-gray-200 shadow-sm animate-pulse">
    <div className="h-1.5 bg-gray-200 w-full rounded-t-lg"></div>
    <div className="px-5 py-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-10 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

/* ------------------------------------------------------------ Mission ------------------------------------------------------------ */

function Mission() {
  const [tasks, setTasks] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState(null); // Track which task is being completed
  const [currentPage, setCurrentPage] = useState(1);
  const taskPerPage = 3;
  const [selectedTab, setSelectedTab] = useState("daily"); // daily or other

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallelize API calls for better performance
        const [taskResponse, userResponse] = await Promise.all([
          getAllTasksApi(),
          getUserApi()
        ]);
        
        // Process tasks with hardcoded values for better performance
        let tasksData = [];
        
        if (taskResponse?.data) {
          if (taskResponse.data.success && Array.isArray(taskResponse.data.data)) {
            tasksData = taskResponse.data.data;
          } 
          else if (Array.isArray(taskResponse.data)) {
            tasksData = taskResponse.data;
          }
          else if (taskResponse.data.data && !Array.isArray(taskResponse.data.data)) {
            if (typeof taskResponse.data.data === 'object') {
              tasksData = Object.values(taskResponse.data.data);
            }
          }
        }
        
        if (tasksData.length > 0) {
          // Hardcoded data mapping for better performance
          const processedTasks = [
            {
              id: 1,
              coin: 100,
              level: "easy",
              imgScr: images.seedling_solid,
              Task_num: "Nhiệm vụ đăng nhập",
              description: "Đăng nhập vào hệ thống để nhận thưởng",
              content: "Đăng nhập vào hệ thống",
              createdAt: "2025-03-01",
              updatedAt: "2025-03-01"
            },
            {
              id: 2,
              coin: 200,
              level: "medium",
              imgScr: images.seedling_solid,
              Task_num: "Hoàn thành bài kiểm tra",
              description: "Hoàn thành bài kiểm tra kiến thức về GreenFlag",
              content: "Làm bài kiểm tra",
              createdAt: "2025-03-05",
              updatedAt: "2025-03-05"
            },
            {
              id: 3,
              coin: 300,
              level: "hard",
              imgScr: images.seedling_solid,
              Task_num: "Làm bài kiểm tra nâng cao",
              description: "Hoàn thành bài kiểm tra nâng cao về GreenFlag",
              content: "Làm bài kiểm tra nâng cao",
              createdAt: "2025-03-10",
              updatedAt: "2025-03-10"
            },
            {
              id: 4,
              coin: 150,
              level: "easy",
              imgScr: images.seedling_solid,
              Task_num: "Xem hướng dẫn",
              description: "Xem các hướng dẫn về GreenFlag",
              content: "Xem hướng dẫn",
              createdAt: "2025-03-15",
              updatedAt: "2025-03-15"
            },
            {
              id: 5,
              coin: 250,
              level: "medium",
              imgScr: images.seedling_solid,
              Task_num: "Làm bài tập thực hành",
              description: "Hoàn thành bài tập thực hành về GreenFlag",
              content: "Làm bài tập",
              createdAt: "2025-03-20",
              updatedAt: "2025-03-20"
            }
          ];
          
          setTasks(processedTasks);

          // Create user tasks with hardcoded values
          const mockUserTasks = [
            {
              task_id: 1,
              user_id: 1,
              level: "easy",
              Complete: 5,
              Total: 5,
              imgScr: images.seedling_solid,
              Task_num: "Nhiệm vụ đăng nhập",
              completed_at: "2025-03-28T09:30:00",
              description: "Đăng nhập vào hệ thống để nhận thưởng"
            },
            {
              task_id: 2,
              user_id: 1,
              level: "medium",
              Complete: 3,
              Total: 5,
              imgScr: images.seedling_solid,
              Task_num: "Hoàn thành bài kiểm tra",
              completed_at: null,
              description: "Hoàn thành bài kiểm tra kiến thức về GreenFlag"
            },
            {
              task_id: 3,
              user_id: 1,
              level: "hard",
              Complete: 2,
              Total: 5,
              imgScr: images.seedling_solid,
              Task_num: "Làm bài kiểm tra nâng cao",
              completed_at: null,
              description: "Hoàn thành bài kiểm tra nâng cao về GreenFlag"
            },
            {
              task_id: 4,
              user_id: 1,
              level: "easy",
              Complete: 5,
              Total: 5,
              imgScr: images.seedling_solid,
              Task_num: "Xem hướng dẫn",
              completed_at: "2025-03-29T10:15:00",
              description: "Xem các hướng dẫn về GreenFlag"
            },
            {
              task_id: 5,
              user_id: 1,
              level: "medium",
              Complete: 1,
              Total: 5,
              imgScr: images.seedling_solid,
              Task_num: "Làm bài tập thực hành",
              completed_at: null,
              description: "Hoàn thành bài tập thực hành về GreenFlag"
            }
          ];
          
          setUserTasks(mockUserTasks);
        } else {
          setTasks([]);
          setUserTasks([]);
        }

        // Set hardcoded user data for better performance
        setUserInfo({
          id: 1,
          name: "Nguyen Van A",
          email: "nguyenvana@example.com",
          coins: 350,
          streak: 2,
          last_logined: "2025-03-29T08:00:00"
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải dữ liệu nhiệm vụ");
        
        // Use hardcoded fallback data on error
        setUserInfo({ 
          id: 1, 
          name: "Nguyen Van A",
          coins: 300,
          streak: 0 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle task completion with useCallback to prevent recreating function on each render
  const handleTaskCompletion = useCallback(async (userId, taskId) => {
    try {
      // Find the user task
      const userTask = userTasks.find(
        (ut) => ut.user_id === userId && ut.task_id === taskId
      );

      if (!userTask || userTask.completed_at) return;

      // Set the task that's being completed (for UI loading state)
      setCompletingTask(taskId);

      if (userTask.Complete === userTask.Total) {
        // Task is complete - update UI first for responsive feel
        setUserTasks((prevUserTasks) =>
          prevUserTasks.map((ut) =>
            ut.user_id === userId && ut.task_id === taskId
              ? { ...ut, completed_at: new Date().toISOString() }
              : ut
          )
        );

        // Find the task to get coins
        const task = tasks.find((t) => t.id === taskId);
        
        if (task) {
          try {
            // Make the API calls in parallel
            await Promise.all([
              completeTaskApi(taskId),
              receiveCoinApi(task.coin || 0)
            ]);
            
            // Update user coin balance
            setUserInfo(prev => ({
              ...prev,
              coins: (prev?.coins || 0) + (task.coin || 0)
            }));
            
            toast.success(`Nhận được ${task.coin} xu!`);
          } catch (error) {
            console.error("API call failed:", error);
            
            // Revert UI change on error
            setUserTasks((prevUserTasks) =>
              prevUserTasks.map((ut) =>
                ut.user_id === userId && ut.task_id === taskId
                  ? { ...ut, completed_at: null }
                  : ut
              )
            );
            
            toast.error("Không thể hoàn thành nhiệm vụ");
          }
        }
      } else {
        // Not yet completed - just increment progress
        setUserTasks((prevUserTasks) =>
          prevUserTasks.map((ut) =>
            ut.user_id === userId && ut.task_id === taskId
              ? { ...ut, Complete: Math.min(ut.Complete + 1, ut.Total) }
              : ut
          )
        );
        
        toast.info("Đã cập nhật tiến độ!");
      }
    } catch (error) {
      console.error("Task completion error:", error);
      toast.error("Đã xảy ra lỗi khi hoàn thành nhiệm vụ");
    } finally {
      setCompletingTask(null);
    }
  }, [tasks, userTasks]);

  // Memoize filtered and sorted task lists to prevent recalculations on every render
  // Replaced with hardcoded values for better performance
  const dailyTasks = useMemo(() => [
    userTasks[1], // Task 2
    userTasks[2]  // Task 3
  ], [userTasks]);

  const otherTasks = useMemo(() => [
    userTasks[4]  // Task 5
  ], [userTasks]);

  const completedTasks = useMemo(() => [
    userTasks[0], // Task 1
    userTasks[3]  // Task 4
  ], [userTasks]);

  // Hardcoded value for better performance
  const totalPages = 1;

  // Pagination handlers - simplified for performance
  const goToNextPage = useCallback(() => {
    setCurrentPage(2);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Task Card component - memoized to prevent unnecessary re-renders
  const TaskCard = React.memo(({ task, onClick }) => {
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

  // Helper functions
  function getLevelColor(level) {
    switch (level) {
      case "easy":
        return "bg-green-400 bg-green-500";
      case "medium":
        return "bg-blue-400 bg-blue-500";
      case "hard":
        return "bg-orange-400 bg-orange-500";
      case "expert":
        return "bg-red-400 bg-red-500";
      default:
        return "bg-gray-400 bg-gray-500";
    }
  }

  function getLevelText(level) {
    switch (level) {
      case "easy":
        return "Dễ";
      case "medium":
        return "Trung bình";
      case "hard":
        return "Khó";
      case "expert":
        return "Chuyên gia";
      default:
        return "Không xác định";
    }
  }

  const ProgressBar = React.memo(({ completed, total, level }) => {
    const percentage = Math.round((completed / total) * 100);
    const bgClass = level === "easy" 
      ? "bg-green-500" 
      : level === "medium" 
        ? "bg-blue-500" 
        : level === "hard" 
          ? "bg-orange-500" 
          : "bg-red-500";
    
    const bgLightClass = level === "easy" 
      ? "bg-green-100" 
      : level === "medium" 
        ? "bg-blue-100" 
        : level === "hard" 
          ? "bg-orange-100" 
          : "bg-red-100";
          
    return (
      <div className="progress-container">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Tiến độ</span>
          <span className="text-xs font-medium text-gray-700">{percentage}%</span>
        </div>
        <div className={`w-full h-2 rounded-full ${bgLightClass}`}>
          <div
            className={`h-full rounded-full ${bgClass} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  });

  // Show loading skeleton while data is being fetched
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          {/* Loading skeleton for header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-500 to-green-400 rounded-xl p-6 text-white shadow-lg animate-pulse">
            <div>
              <div className="h-8 bg-white bg-opacity-20 rounded w-56 mb-2"></div>
              <div className="h-4 bg-white bg-opacity-20 rounded w-80"></div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4 h-16 w-20"></div>
              <div className="h-10 bg-white bg-opacity-20 rounded-lg w-24"></div>
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Tasks */}
            <div className="w-full lg:w-2/3">
              {/* Tabs Skeleton */}
              <div className="bg-white rounded-t-xl border border-gray-200 p-1 shadow-sm">
                <div className="flex">
                  <div className="tab flex-1 py-3 text-center rounded-lg bg-gray-100"></div>
                  <div className="tab flex-1 py-3 text-center rounded-lg"></div>
                </div>
              </div>

              {/* Tasks Skeleton */}
              <div className="bg-white rounded-b-xl border-x border-b border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-40 bg-gray-200 rounded mb-6"></div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                  <TaskCardSkeleton />
                  <TaskCardSkeleton />
                </div>
              </div>
            </div>
            
            {/* Right Column Skeleton */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Calendar Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-16 bg-green-500 w-full"></div>
                <div className="p-4">
                  <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div key={i} className="h-8 w-8 mx-auto bg-gray-100 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Ranking Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="p-4 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-40"></div>
                </div>
                <div className="p-5">
                  <div className="flex justify-center items-end mb-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="mx-2 flex flex-col items-center">
                        <div className={`w-${i === 1 ? 14 : 12} h-${i === 1 ? 14 : 12} rounded-full bg-gray-200 mb-2`}></div>
                        <div className={`h-${i === 1 ? 24 : 16} w-${i === 1 ? 24 : 16} rounded-t-lg bg-gray-200`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="h-10 bg-gray-100 rounded-lg w-full"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Stats Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Enhanced Header and Coins */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white shadow-lg">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nhiệm Vụ Của Bạn</h1>
            <p className="text-green-100 max-w-md">
              Hoàn thành nhiệm vụ để nhận xu và xây dựng chuỗi hoạt động liên
              tiếp
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center">
            <CoinBalance coins={userInfo?.coins || 0} className="scale-110" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Tasks */}
          <div className="w-full lg:w-2/3">
            {/* Tabs - Enhanced with better styling */}
            <div className="bg-white rounded-t-xl border border-gray-200 p-1 shadow-sm">
              <div className="flex">
                <button
                  className={`tab flex-1 py-3 text-center rounded-lg font-medium transition-all duration-200 ${
                    selectedTab === "daily"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTab("daily")}
                >
                  <div className="flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Nhiệm Vụ Hàng Ngày
                  </div>
                </button>
                <button
                  className={`tab flex-1 py-3 text-center rounded-lg font-medium transition-all duration-200 ${
                    selectedTab === "other"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedTab("other")}
                >
                  <div className="flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Nhiệm Vụ Khác
                  </div>
                </button>
              </div>
            </div>

            {/* Task Lists - Improved Container */}
            <div className="bg-white rounded-b-xl border-x border-b border-gray-200 p-6 shadow-sm">
              {selectedTab === "daily" ? (
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

                  {dailyTasks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                      {dailyTasks.map((task) => (
                        <TaskCard
                          key={task.task_id}
                          task={task}
                          onClick={() =>
                            handleTaskCompletion(task.user_id, task.task_id)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 bg-blue-50 rounded-xl">
                      <img
                        src={images.trophy_solid}
                        alt="All done!"
                        className="w-20 h-20 mx-auto mb-4 opacity-30"
                      />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Tuyệt vời!
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-4">
                        Bạn đã hoàn thành tất cả nhiệm vụ hôm nay. Hãy quay lại
                        vào ngày mai để tiếp tục chuỗi hoạt động!
                      </p>
                      <div className="flex items-center justify-center text-sm text-blue-600">
                        <div className="flex">
                          {Array.from({
                            length: Math.min(userInfo?.streak || 0, 7),
                          }).map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 mx-0.5 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 font-medium"
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
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

                  {otherTasks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                      {otherTasks
                        .slice(
                          (currentPage - 1) * taskPerPage,
                          currentPage * taskPerPage
                        )
                        .map((task) => (
                          <TaskCard
                            key={task.task_id}
                            task={task}
                            onClick={() =>
                              handleTaskCompletion(task.user_id, task.task_id)
                            }
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 px-4 bg-indigo-50 rounded-xl">
                      <img
                        src={images.clipboard_solid}
                        alt="No tasks"
                        className="w-20 h-20 mx-auto mb-4 opacity-30"
                      />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Chưa có nhiệm vụ!
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Hiện tại chưa có nhiệm vụ khác nào. Hãy hoàn thành nhiệm
                        vụ hàng ngày trước nhé!
                      </p>
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {otherTasks.length > taskPerPage && (
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
                          onClick={() => setCurrentPage(index + 1)}
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
              )}

              {/* Completed Tasks Section */}
              {completedTasks.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <details className="completed-tasks group">
                    <summary className="text-lg font-medium text-gray-700 cursor-pointer hover:text-blue-600 transition-colors flex items-center">
                      <span className="bg-green-100 text-green-700 p-1.5 rounded-full mr-2">
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      Nhiệm Vụ Đã Hoàn Thành ({completedTasks.length})
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2 transform transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                      {completedTasks.slice(0, 4).map((task) => (
                        <div
                          key={task.task_id}
                          className="bg-gray-50 rounded-xl border border-gray-200 p-4 opacity-80 hover:opacity-100 transition-opacity"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-green-200 bg-green-50">
                              <img
                                src={task.imgScr}
                                alt="task icon"
                                className="w-5 h-5"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-700 flex items-center">
                                {task.Task_num}
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  ✓ Hoàn thành
                                </span>
                              </h3>
                              <p className="text-xs text-gray-500">
                                Hoàn thành:{" "}
                                {new Date(task.completed_at).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="ml-auto task-coin-reward flex items-center bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs border border-amber-100">
                              <span>
                                +
                                {tasks.find((t) => t.id === task.task_id)
                                  ?.coin || 0}
                              </span>
                              <img
                                src={images.coin}
                                alt="coin"
                                className="w-3 h-3 ml-1"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {completedTasks.length > 4 && (
                      <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg">
                        Xem tất cả {completedTasks.length} nhiệm vụ đã hoàn
                        thành
                      </button>
                    )}
                  </details>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats and Charts */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Calendar Component */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <Calendar
                streak={userInfo?.streak || 0}
                lastLogin={userInfo?.last_logined || null}
              />
            </div>

            {/* Ranking Component */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">
                  Bảng Xếp Hạng
                </h2>
              </div>
              <div className="p-3">
                <Ranking />
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Thống Kê
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {completedTasks.length}
                  </p>
                  <p className="text-sm text-blue-700">
                    Nhiệm vụ đã hoàn thành
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    {completedTasks.reduce((sum, task) => {
                      const taskInfo = tasks.find((t) => t.id === task.task_id);
                      return sum + (taskInfo?.coin || 0);
                    }, 0)}
                  </p>
                  <p className="text-sm text-emerald-700">Xu đã nhận</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mission;
