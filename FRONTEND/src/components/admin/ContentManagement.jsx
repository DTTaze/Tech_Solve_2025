import React, { useState } from "react";
import DataTable from "./DataTable";
import {
  taskColumns,
  tasksData,
  itemColumns,
  itemsData,
  videoColumns,
  videosData,
  avatarColumns,
  avatarsData,
} from "../../data/mock-data";
import { Box, Typography } from "@mui/material";
import AdminTabs from "./AdminTabs";

// Tasks Management Component
function TasksManagement() {
  const [tasks, setTasks] = useState(tasksData);
  const [loading, setLoading] = useState(false);

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
  const [items, setItems] = useState(itemsData);
  const [loading, setLoading] = useState(false);

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
  const [videos, setVideos] = useState(videosData);
  const [loading, setLoading] = useState(false);

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
  const [avatars, setAvatars] = useState(avatarsData);
  const [loading, setLoading] = useState(false);

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
