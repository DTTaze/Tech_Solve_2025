import React, { useState } from "react";
import Calenda from "./calendar.jsx"
import Ranking from "./chartRank.jsx";
import "./Mission.css";
import images from "./photo.jsx";
// import {motion} from 'framer-motion'
import { Button } from 'antd';
import { Footer } from "antd/es/layout/layout.js";

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

  

  const HeroSection = () => {
    const scrollToNextSection = () => {
      const nextSection = document.getElementById("day-mission");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    };
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1}}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${images.anh_trong_cay_gpt})`,
          height: "600px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: '10px' }}
      >
         <motion.h1
          initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 10, filter: "blur(0px)"}}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-overlay"
          style={{top:'3%'}}
        >
          HÀNH ĐỘNG XANH...
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 15, filter: "blur(0px)"}}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-overlay"
          style={{top:'10%', left:'15%',fontStyle: 'italic' }}
        >
          ...TƯƠNG LAI XANH
        </motion.h1>
        <motion.button 
          type="primary" 
          shape="round" 
          size={'large'} 
          initial={{ opacity: 0, x: 50, y: 120, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 50, y: 120, filter: "blur(0px)"}}
          transition={{ delay: 2.0, duration: 1 }}
          className="btn-try-now"
          onClick={scrollToNextSection}
          >
            THAM GIA NGAY
        </motion.button>
      </motion.div>
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
    <div className="Mission_rank_container">
      <div className="section_hero">
        <HeroSection/>
      </div>
      <div id = 'day-mission' className="day_mission_container">
        <div className="header">
          <h1>nhiệm vụ hàng ngày</h1>
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
                <Calenda />
              </div>
              <div>
                <Ranking />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="another-mission-container">
        <div className="header">
          <h1>nhiệm vụ khác</h1>
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
            <button onClick={goToPreviousPage} disabled={CurrentPage === 1} className="pagination-button">
                &lt;
            </button>
            <span>{CurrentPage} of {totalPages}</span>
            <button onClick={goToNextPage} disabled={CurrentPage === totalPages} className='pagination-button'>
                &gt;
            </button>
          </div>
          )}
        <div>
          <Footer className="footer">
            Liên hệ: 012345678
          </Footer>
        </div>
      </div>
    </div>
  );
}

export default Mission;
