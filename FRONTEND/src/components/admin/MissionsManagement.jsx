import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { taskColumns } from "./HeaderColumn";
import {
  getAllTasksApi,
  deleteTaskApi,
  updateTaskApi,
  createTaskApi,
} from "../../utils/api";
import { Box } from "@mui/material";
import TaskForm from "./form/TaskForm";

export default function TasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllTasksApi();

        if (res.success) {
          setTasks(res.data);
        } else {
          console.log(res.error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleAddTask = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditTask = (task) => {
    setFormMode("edit");
    setEditData(task);
    setFormOpen(true);
  };

  const handleDeleteTask = async (task) => {
    const res = await deleteTaskApi(task.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa nhiệm vụ thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== task.id));
      }
    }
  };
  const handleSubmitTask = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createTaskApi(data);
        if (result.success) {
          alert("Thêm nhiệm vụ thành công!");
        } else {
          alert("Thêm nhiệm vụ thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateTaskApi(data.id, data);
        if (result.success) {
          alert("Cập nhật nhiệm vụ thành công!");
        } else {
          alert("Cập nhật nhiệm vụ thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    }
    setFormOpen(false);
  };
  return (
    <Box>
      <DataTable
        title="Tasks"
        columns={taskColumns}
        rows={tasks}
        onAdd={handleAddTask}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        loading={loading}
      />
      <TaskForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitTask}
        initialData={editData}
        mode={formMode}
      />
    </Box>
  );
}
