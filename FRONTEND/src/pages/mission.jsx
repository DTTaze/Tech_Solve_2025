import React, { useState } from "react";
import Calendar from "../components/calendar.jsx";
import Ranking from "../components/chartRank.jsx";
import "../styles/pages/mission.scss";
import images from "../components/photo.jsx";
import { Footer } from "antd/es/layout/layout.js";
import { motion } from "framer-motion";
import Header from "../components/header.jsx"

/* ------------------------------------------------------------ Task ------------------------------------------------------------ */

function Mission() {
  const [task_item, setTask_item] = useState([
    {
      id: 1,
      Complete: 6,
      Total: 6,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 1",
    },
    {
      id: 2,
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 2",
    },
    {
      id: 3,
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 3",
    },
    {
      id: 4,
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 4",
    },
    {
      id: 5,
      Complete: 3,
      Total: 5,
      imgScr: images.seedling_solid,
      Task_num: "Nhiệm vụ 5",
    },
  ]);

  const addTask = ({ Complete, Total, imgScr, Task_num }) => {
    const newTask = {
      id: task_item.length + 1,
      Complete: Complete,
      Total: Total,
      imgScr: imgScr,
      Task_num: Task_num,
    };
    setTask_item([...task_item, newTask]);
  };

  const removeTask = (id) => {
    setTask_item(task_item.filter((task) => task.id !== id));
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

  const Task = ({ Complete, Total, imgScr, Task_num }) => {
    return (
      <div className="task-container">
        <div className="image-container">
          <img src={imgScr} alt="plant" className="task-img" />
        </div>
        <div className="task-name">
          <h3 style={{ textAlign: "left" }}>{Task_num}</h3>
          <ProgressBar completed={Complete} total={Total} />
        </div>
      </div>
    );
  };



  const [CurrentPage, setCurrentPage] = useState(1);
  const TaskPerPage = 3;
  const totalTasks = task_item.length;

  const indexOfLastTask = CurrentPage * TaskPerPage;
  const indexOfFirstTask = indexOfLastTask - TaskPerPage;
  const currentTasks = task_item.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(totalTasks / TaskPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="main-mission-container">
      <div className="header">
       <Header/>
      </div>
      <div id="day-mission" className="day_mission_container">
        <div className="day-mission-header">
          <h1 >NHIỆM VỤ HÀNG NGÀY</h1>
        </div>
        <div className="container">
          <div className="item1">
            <div className="mission-container">
              {task_item.map((item) => (
                <button className="task-button">
                  <Task
                    key={item.id}
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
          <h1>NHIỆM VỤ KHÁC</h1>
        </div>
        <div className="mission-container" style={{ width: "98%" }}>
          {currentTasks.map((item) => (
            <button className="task-button">
              <Task
                key={item.id}
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
        <div>
          <Footer className="footer">Liên hệ: 012345678</Footer>
        </div>
      </div>
    </div>
  );
}

export default Mission;
