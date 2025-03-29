import React, { useState } from "react";
import Calendar from "../components/features/missions/Calendar.jsx";
import Ranking from "../components/features/missions/ChartRank.jsx";
import "../styles/pages/mission.scss";
import images from "../components/features/exchangemarket/Photo.jsx";
import CoinBalance from "../components/exchangemarket/CoinBalance.jsx";

/* ------------------------------------------------------------ Task ------------------------------------------------------------ */

function Mission() {
  // đây là list các nhiệm vụ của web
  const [task, setTask] = useState([
    {
      id: 1,
      coin: 7,
      level: 'hard',
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 1",
    },
    {
      id: 2,
      coin: 5,
      level: 'medium',
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 2",
    },
    {
      id: 3,
      coin: 3,
      level: 'easy',
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 3",
    },
    {
      id: 4,
      coin: 5,
      level: 'medium',
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 4",
    },
    {
      id: 5,
      coin: 3,
      level: 'easy',
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 5",
    },
  ]);


// đây là list các nhiệm vụ mà user đã và đang làm
  const [user_tasks, setUser_tasks] = useState([
    {
      task_id: 1,
      user_id: 1,
      level: "hard",
      Complete: 6,
      Total: 6,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 1",
      completed_at: null
    },
    {
      task_id: 2,
      user_id: 1,
      level: "medium",
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 2",
      completed_at: null
    },
    {
      task_id: 3,
      user_id: 1,
      level: "easy",
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 3",
      completed_at: null
    },
    {
      task_id: 4,
      user_id: 1,
      level: "hard",
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 4",
      completed_at: null
    },
    {
      task_id: 5,
      user_id: 1,
      level: "medium",
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 5",
      completed_at: null
    },
  ]);

  const [userInfo, setUserInfo] = useState([{user_id: 1, coins: 300}, {user_id: 2, coins: 350}, {user_id: 3, coins: 500}]);

  const addTask = ({ Complete, Total, imgScr, Task_num }) => {
    const newTask = {
      id: user_tasks.length + 1,
      Complete: Complete,
      Total: Total,
      imgScr: imgScr,
      Task_num: Task_num,
    };
    setUser_tasks([...user_tasks, newTask]);
  };

  const removeTask = (id) => {
    setUser_tasks(user_tasks.filter((task) => task.id !== id));
  };

  const ProgressBar = ({ completed, total }) => {
    const percentage = (completed / total) * 100;
    return (
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>

        <div>
          <p>
            ({completed}/{total})
          </p>
        </div>
      </div>
    );
  };

  const Task = ({ Level, Complete, Total, imgScr, Task_num }) => {
    return (
      <div className="task-container">
        <div className="image-container">
          <img src={imgScr} alt="plant" className="task-img" />
        </div>
        <div className="task-name">
          <div className="flex items-center py-2 justify-between font-semibold">
            <h2 style={{ textAlign: "left" }}>{Task_num}</h2>
            <span className={`px-2 py-1 rounded-[15px] text-white font-semibold min-w-[80px] ${
              Level === "easy" ? "bg-green-400" :
              Level === "medium" ? "bg-yellow-400" :
              Level === "hard" ? "bg-red-400" : "bg-gray-500"
            }`}>{Level}</span>
          </div>
          
          <ProgressBar completed={Complete} total={Total} />
        </div>
      </div>
    );
  };
// hàm sử dụng để cập nhật coins sau khi đã hoàn thành nhiệm vụ
const HandleClickTask = ({ UserId, taskId }) => {
  setUserInfo((prevUserInfo) => {
    return prevUserInfo.map((user) => {
      if (user.user_id === UserId) {
        let newCoins = user.coins || 0;

        // Tìm nhiệm vụ của user dựa trên taskId
        const userTask = user_tasks.find(
          (ut) => ut.user_id === UserId && ut.task_id === taskId
        );

        if (userTask && userTask.Complete === userTask.Total) {
          // Tìm thông tin nhiệm vụ trong danh sách task để lấy số coin
          const taskInfo = task.find((t) => t.id === taskId);
          if (taskInfo) {
            newCoins += taskInfo.coin; // Cộng số coin từ task
            setUser_tasks((prevUserTasks) =>
              prevUserTasks.map((ut) =>
                ut.user_id === UserId && ut.task_id === taskId
                  ? { ...ut, completed_at: new Date().toISOString() } // Lưu thời gian hoàn thành
                  : ut
              )
            );
          }
        }

        console.log(`Updated coins for user ${UserId}: ${newCoins}`);
        return { ...user, coins: newCoins };
      }
      return user;
    });
  });
};



  const [CurrentPage, setCurrentPage] = useState(1);
  const TaskPerPage = 3;
  const totalTasks = user_tasks.length;

  const indexOfLastTask = CurrentPage * TaskPerPage;
  const indexOfFirstTask = indexOfLastTask - TaskPerPage;
  const currentTasks = user_tasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(totalTasks / TaskPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // user tam thoi de test
  const userInfo_test = userInfo.find(value => value.user_id === 1)

  return (
    <div>
      <div className="main-mission-container w-[80vw] m-auto mt-20">
        <div className="width">
          <CoinBalance coins = {userInfo_test.coins}/>
        </div>
        <div id="day-mission" className="day_mission_container">
          <div className="day-mission-header">
            <p className="font-semibold text-2xl">NHIỆM VỤ HÀNG NGÀY</p>
          </div>
          <div className="mission-date-rank-container">
            <div className="item1">
              <div className="mission-container">
                {user_tasks
                  .filter((item) => item.user_id === 1 && !item.completed_at) 
                  .map((item) => (
                    <button
                      key={item.task_id}
                      className={`task-button ${item.Complete === item.Total ? "completed" : ""}`}
                      onClick={() =>
                        HandleClickTask({
                          UserId: item.user_id,
                          taskId: item.task_id,
                        })
                      }
                    >
                      <Task
                        Level={item.level}
                        Complete={item.Complete}
                        Total={item.Total}
                        imgScr={item.imgScr}
                        Task_num={item.Task_num}
                      />
                    </button>
                  ))}
              </div>
            </div>
            <div className="item2">
              <div className="Mission_rank_container">
                <div>
                  <Calendar />
                </div>
                <div>
                  <Ranking />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="another-mission-container">
          <div className="day-mission-header">
          <p className="font-semibold text-2xl">NHIỆM VỤ KHÁC</p>
          </div>
          <div className="mission-container">
          {currentTasks
                  .filter((item) => item.user_id === 1 && !item.completed_at) 
                  .map((item) => (
                    <button
                      key={item.task_id}
                      className={`task-button ${item.Complete === item.Total ? "completed" : ""}`}
                      onClick={() =>
                        HandleClickTask({
                          UserId: item.user_id,
                          taskId: item.task_id,
                        })
                      }
                    >
                      <Task
                        Level={item.level}
                        Complete={item.Complete}
                        Total={item.Total}
                        imgScr={item.imgScr}
                        Task_num={item.Task_num}
                      />
                    </button>
                  ))}
          </div>
          {totalTasks > TaskPerPage && (
            <div className="pagination">
              <button
                onClick={goToPreviousPage}
                disabled={CurrentPage === 1}
                className="pagination-button"
              >
                &lt;
              </button>
              <span>
                {CurrentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={CurrentPage === totalPages}
                className="pagination-button"
              >
                &gt;
              </button>
            </div>
          )}
        </div> 
      </div>
      <Footer/>
    </div>
  );
}

export default Mission;
