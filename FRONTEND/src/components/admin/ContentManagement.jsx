import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import {
  taskColumns,
  itemColumns,
  videoColumns,
  avatarColumns,
} from "./HeaderColumn";
import {
  getAllTasksApi,
  getAllItemsApi,
  getAllVideosApi,
  getAllUserAvatarsApi,
  deleteTaskApi,
  updateTaskApi,
  createTaskApi,
  deleteItemApi,
} from "../../utils/api";
import { Box, Typography } from "@mui/material";
import AdminTabs from "./AdminTabs";
import TaskForm from "../ui/form/TaskForm";
import ItemForm from "../ui/form/ItemForm";
// Tasks Management Component
function TasksManagement() {
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

// Items Management Component
function ItemsManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formMode, setFormMode] = useState("add");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllItemsApi();

        if (res.success) {
          setItems(res.data);
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
  const handleAddItem = () => {
    setFormMode("add");
    setEditData(null);
    setFormOpen(true);
  };

  const handleEditItem = (item) => {
    setFormMode("edit");
    setEditData(item);
    setFormOpen(true);
  };

  const handleDeleteItem = async (item) => {
    const res = await deleteItemApi(item.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa vật phẩm thành công!");
        setUsers((prev) => prev.filter((u) => u.id !== item.id));
      }
    }
  };
  const handleSubmitItem = async (data, mode) => {
    if (mode === "add") {
      try {
        const result = await createItemApi(data.id, data);
        if (result.success) {
          alert("Thêm vật phẩm thành công!");
        } else {
          alert("Thêm vật phẩm thất bại!");
        }
      } catch (e) {
        alert(e);
      }
    } else if (mode === "edit") {
      try {
        const result = await updateItemApi(data.id, data);
        if (result.success) {
          alert("Cập nhật vật phẩm thành công!");
        } else {
          alert("Cập nhật vật phẩm thất bại!");
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
        title="Items"
        columns={itemColumns}
        rows={items}
        onAdd={handleAddItem}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        loading={loading}
      />
      <ItemForm
        open={formOpen}
        handleClose={() => setFormOpen(false)}
        handleSubmit={handleSubmitItem}
        initialData={editData}
        mode={formMode}
      />
    </Box>
  );
}

// Videos Management Component
function VideosManagement() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllVideosApi();
        if (res.success) {
          setVideos(res.data);
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
  const handleAddVideo = () => {
    console.log("Add video");
  };

  const handleEditVideo = (video) => {
    console.log("Edit video", video);
  };

  const handleDeleteVideo = (video) => {
    console.log("Delete video", video);
  };

  return (
    <DataTable
      title="Videos"
      columns={videoColumns}
      rows={videos}
      onAdd={handleAddVideo}
      onEdit={handleEditVideo}
      onDelete={handleDeleteVideo}
      loading={loading}
    />
  );
}

// Avatars Management Component
function AvatarsManagement() {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllUserAvatarsApi();

        if (res.success) {
          setAvatars(res.data);
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
  const handleAddAvatar = () => {
    console.log("Add avatar");
  };

  const handleEditAvatar = (avatar) => {
    console.log("Edit avatar", avatar);
  };

  const handleDeleteAvatar = (avatar) => {
    console.log("Delete avatar", avatar);
  };

  return (
    <DataTable
      title="Avatars"
      columns={avatarColumns}
      rows={avatars}
      onAdd={handleAddAvatar}
      onEdit={handleEditAvatar}
      onDelete={handleDeleteAvatar}
      loading={loading}
    />
  );
}

// Main Content Management Component
export default function ContentManagement() {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const tabs = [
    { label: "Tasks", content: <TasksManagement /> },
    { label: "Items", content: <ItemsManagement /> },
    { label: "Videos", content: <VideosManagement /> },
    { label: "Avatars", content: <AvatarsManagement /> },
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3, p: 2 }}>
        Content Management
      </Typography>
      <AdminTabs tabs={tabs} />
    </Box>
  );
}
