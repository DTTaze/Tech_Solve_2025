import React, { useState, useEffect, useMemo, useCallback } from "react";
import Calendar from "../components/features/missions/Calendar.jsx";
import Ranking from "../components/features/missions/ChartRank.jsx";
import images from "../components/features/exchangemarket/Photo.jsx";
import {
  getAllTasksApi,
  completeTaskApi,
  receiveCoinApi,
  getUserApi,
  getTaskByIdApi,
  increaseProgressCountApi,
  AllTaskByIdApi
} from "../utils/api.js";
import { toast } from "react-toastify";
import TaskCardSkeleton from "../components/features/missions/TaskCardSkeleton.jsx";
import TasksList from "../components/features/missions/TasksList.jsx";
import MissionHeader from "../components/features/missions/MissionHeader.jsx";
import MissionTabs from "../components/features/missions/MissionTabs.jsx";
import {
  getLevelColor,
  getLevelText,
} from "../components/features/missions/TaskUtils.jsx";
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
  const [dailyTasks, setDailyTasks] = useState([]);
  const [otherTasks, setOtherTasks] = useState([]);

  // Function to fetch new tasks
  const fetchNewTasks = async () => {
    try {
      setLoading(true);
      const taskResponse = await getAllTasksApi();

      if (taskResponse?.data?.success) {
        const tasksData = taskResponse.data.data.map((task) => ({
          id: task.id,
          title: task.title,
          content: task.content,
          description: task.description,
          coins: task.coins,
          difficulty: task.difficulty,
          created_at: task.createdAt,
          updated_at: task.updatedAt,
          total: task.total || 1,
        }));
        setTasks(tasksData);

        // Create user tasks from the tasks data
        const userTasksData = tasksData.map((task) => ({
          id: task.id,
          task_id: task.id,
          user_id: userResponse.data.id || 1,
          progress_count: null,
          completed_at: null,
          assigned_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          difficulty: task.difficulty,
        }));

        setUserTasks(userTasksData);
        toast.success("Đã tải nhiệm vụ mới!");
      } else {
        toast.error("Không thể tải nhiệm vụ mới");
      }
    } catch (error) {
      console.error("Failed to fetch new tasks:", error);
      toast.error("Đã xảy ra lỗi khi tải nhiệm vụ mới");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        console.log("Fetching data from APIs...");

        // Parallelize API calls for better performance
        const [taskResponse, userResponse] = await Promise.all([
          getAllTasksApi(),
          getUserApi(),
        ]);

        console.log("Task response:", taskResponse);
        console.log("User response:", userResponse);

        
        // Process tasks from API response
        let tasksData = [];

        if (taskResponse?.data) {
          console.log("Processing task response data...");
          if (
            taskResponse.data.success &&
            Array.isArray(taskResponse.data.data)
          ) {
            tasksData = taskResponse.data.data;
          } else if (Array.isArray(taskResponse.data)) {
            tasksData = taskResponse.data;
          } else if (
            taskResponse.data.data &&
            !Array.isArray(taskResponse.data.data)
          ) {
            if (typeof taskResponse.data.data === "object") {
              tasksData = Object.values(taskResponse.data.data);
            }
          }
        }

        console.log("tasks data:", tasksData);
        // Process user data from API response
        if (userResponse?.data) {
          console.log("Setting user info:", userResponse.data);
          const dataOfUser = {
            id: userResponse.data.id,
            full_name: userResponse.data.full_name || "User",
            email: userResponse.data.email,
            coins: userResponse.data.coins || 0,
            streak: userResponse.data.streak || 0,
            last_logined: userResponse.data.last_logined,
          };
          setUserInfo(dataOfUser);
        } else {
          console.log("No user data found, setting default user info.");
          setUserInfo({
            id: 0,
            name: "Guest User",
            coins: 0,
            streak: 0,
          });
        }

        // Process tasksData
        if (tasksData.length > 0) {
          const processedTasks = tasksData.map((task) => ({
            id: task.id,
            title: task.title,
            content: task.content,
            description: task.description,
            coins: task.coins,
            difficulty: task.difficulty || "easy",
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          }));

          console.log("Processed tasks for UI:", processedTasks);
          setTasks(processedTasks);

          // get user tasks from API
          const userTasksData = await AllTaskByIdApi(userResponse.data.id);
          console.log("User tasks data from API:", userTasksData);

          const processedUserTasksData = userTasksData.data.map((task) => {
            const taskOfUser = processedTasks.find(
              (t) => t.id === task.task_id
            );

            return {
              id: task.id,
              task_id: task.task_id,
              user_id: userResponse.data.id,
              progress_count: task.progress_count,
              assigned_at: task.assigned_at,
              completed_at: task.completed_at,
              created_at: task.created_at,
              updated_at: task.updated_at,
              tasks: task.tasks
            };
          });

          console.log(" user tasks:", processedUserTasksData);
          setUserTasks(processedUserTasksData);
        } else {
          console.log("No task found, setting default null.");
          setTasks([]);
          toast.warning("No tasks available");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Không thể tải dữ liệu nhiệm vụ");
      } finally {
        setLoading(false);
        console.log("Finished fetching data.");
      }
    };

    fetchData();
  },[]);

  // Handle task completion with useCallback to prevent recreating function on each render
  const handleTaskCompletion = useCallback(
    async (userId, taskId) => {
      try {
        const userTask = userTasks.find(
          (ut) => ut.user_id === userId && ut.task_id === taskId
        );

        console.log("User task:", userTask);
  
        if (!userTask) return;
  
        setCompletingTask(taskId);
  
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;
  
        // Gọi API để tăng tiến độ
        const updatedTaskUser = await increaseProgressCountApi(userTask.id);
        console.log("Updated task user:", updatedTaskUser);
  
        // Cập nhật UI từ dữ liệu trả về từ backend
        if(updatedTaskUser.data) {
          setUserTasks((prevUserTasks) =>
            prevUserTasks.map((ut) =>
              ut.id === updatedTaskUser.data.id
                ? {
                    ...ut,
                    progress_count: updatedTaskUser.data.progress_count,
                    completed_at: updatedTaskUser.data.completed_at,
                  }
                : ut
            )
          );
        }
        
        // Nếu task nhiệm vụ đã hoàn thành
        if (updatedTaskUser.data.completed_at) {
          try {
            const completeResponse = await completeTaskApi(userTask.task_id);
            console.log("Task completion response:", completeResponse);
  
            const coinsResponse = await receiveCoinApi(task.coins);
            console.log("Receive coins response:", coinsResponse);
  
            // Cập nhật lại số xu từ backend
            const responseUser = await getUserApi();
            setUserInfo((prev) => {
              const updatedUser = {
                ...prev,
                coins: responseUser?.data?.coins || 0,
              };
              console.log("check user info after receive coins", updatedUser);
              return updatedUser;
            });
  
            toast.success(`Nhận được ${task.coins} xu!`);
          } catch (error) {
            console.error("API call failed:", error);
            toast.error("Không thể hoàn thành nhiệm vụ");
          }
        } else {
          toast.info("Đã cập nhật tiến độ!");
        }
      } catch (error) {
        console.error("Task completion error:", error);
        toast.error("Đã xảy ra lỗi khi hoàn thành nhiệm vụ");
      } finally {
        setCompletingTask(null);
      }
    },
    [tasks, userTasks]
  );
  

  // Memoize filtered and sorted task lists to prevent recalculations on every render

  useEffect(() => {
    const fetchDailyTasks = async () => {
      console.log("UserTask: ", userTasks)
      const tasks = await Promise.all(
        userTasks.map(async (userTask) => {
          const taskData = await getTaskByIdApi(userTask.task_id);
          const task = taskData.data;
          return task
            ? {
                ...task,
                completed_at: userTask.completed_at,
                progress_count: userTask.progress_count,
              }
            : null;
        })
      );

      const filteredTasks = tasks.filter(
        (task) =>
          task &&
          task.completed_at === null &&
          (task.difficulty === "medium" || task.difficulty === "hard")
      );

      setDailyTasks(filteredTasks);
    };

    fetchDailyTasks();
  }, [userTasks]);

  console.log("Daily tasks:", dailyTasks);

  useEffect(() => {
    const fetchOtherTasks = async () => {
      const tasks = await Promise.all(
        userTasks.map(async (userTask) => {
          const taskData = await getTaskByIdApi(userTask.task_id);
          const task = taskData.data;
          return task
            ? {
                ...task,
                completed_at: userTask.completed_at,
                progress_count: userTask.progress_count,
              }
            : null;
        })
      );

      const filteredTasks = tasks.filter(
        (task) =>
          task && task.completed_at === null && task.difficulty === "easy"
      );

      setOtherTasks(filteredTasks);
    };

    fetchOtherTasks();
  }, [userTasks]);

  console.log("Other tasks:", otherTasks);

  const completedTasks = useMemo(() => {
    // Filter for completed tasks
    return userTasks.filter((task) => task.completed_at);
  }, [userTasks]);

  // Calculate total pages based on number of tasks
  const totalPages = useMemo(() => {
    const relevantTasks =
      selectedTab === "daily"
        ? dailyTasks
        : selectedTab === "other"
        ? otherTasks
        : completedTasks;
    return Math.max(1, Math.ceil(relevantTasks.length / taskPerPage));
  }, [dailyTasks, otherTasks, completedTasks, selectedTab, taskPerPage]);

  // Pagination handlers
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

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
                      <div
                        key={i}
                        className="h-6 bg-gray-200 rounded-full"
                      ></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 mx-auto bg-gray-100 rounded-full"
                      ></div>
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
                        <div
                          className={`w-${i === 1 ? 14 : 12} h-${
                            i === 1 ? 14 : 12
                          } rounded-full bg-gray-200 mb-2`}
                        ></div>
                        <div
                          className={`h-${i === 1 ? 24 : 16} w-${
                            i === 1 ? 24 : 16
                          } rounded-t-lg bg-gray-200`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 mt-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-10 bg-gray-100 rounded-lg w-full"
                      ></div>
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
        <MissionHeader userInfo={userInfo} loading={loading} />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Tasks */}
          <div className="w-full lg:w-2/3">
            {/* Tabs */}
            <MissionTabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />

            {/* Task List */}
            <div className="bg-white rounded-b-xl border-x border-b border-gray-200 p-6 shadow-sm">
              {selectedTab === "daily" && dailyTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Không có nhiệm vụ hàng ngày nào
                  </p>
                  <button
                    onClick={fetchNewTasks}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Lấy Nhiệm Vụ Mới
                  </button>
                </div>
              ) : selectedTab === "other" && otherTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Không có nhiệm vụ phụ nào
                  </p>
                  <button
                    onClick={fetchNewTasks}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Lấy Nhiệm Vụ Mới
                  </button>
                </div>
              ) : (
                <TasksList
                  tasks={
                    selectedTab === "daily"
                      ? dailyTasks
                      : selectedTab === "other"
                      ? otherTasks
                      : selectedTab === "completed"
                      ? completedTasks
                      : []
                  }
                  loading={loading}
                  completingTask={completingTask}
                  handleTaskCompletion={handleTaskCompletion}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToNextPage={goToNextPage}
                  goToPreviousPage={goToPreviousPage}
                  userId={userInfo?.id}
                  selectedTab={selectedTab}
                  taskPerPage={taskPerPage}
                />
              )}
            </div>
          </div>

          {/* Right Column - Calendar and Rankings */}
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
                      return sum + (task.coin || 0);
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
