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
} from "../../utils/api";
import { Box, Typography } from "@mui/material";
import AdminTabs from "./AdminTabs";

// Tasks Management Component
function TasksManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
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
    console.log("Add task");
  };

  const handleEditTask = (task) => {
    console.log("Edit task", task);
  };

  const handleDeleteTask = (task) => {
    console.log("Delete task", task);
  };

  return (
    <DataTable
      title="Tasks"
      columns={taskColumns}
      rows={tasks}
      onAdd={handleAddTask}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
      loading={loading}
    />
  );
}

// Items Management Component
function ItemsManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
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
    console.log("Add item");
  };

  const handleEditItem = (item) => {
    console.log("Edit item", item);
  };

  const handleDeleteItem = (item) => {
    console.log("Delete item", item);
  };

  return (
    <DataTable
      title="Items"
      columns={itemColumns}
      rows={items}
      onAdd={handleAddItem}
      onEdit={handleEditItem}
      onDelete={handleDeleteItem}
      loading={loading}
    />
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
