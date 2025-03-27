import React from "react";
import Grid from "@mui/material/Grid";

import { Box, Paper, Typography, Divider, Stack, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import IconButton from "@mui/material/IconButton";

export default function AdminDashboard() {
  // Sample activity data
  const recentActivities = [
    {
      id: 1,
      user: "John Doe",
      action: "created a new task",
      time: "10 minutes ago",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "updated user permissions",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Mike Brown",
      action: "uploaded a new video",
      time: "3 hours ago",
    },
    {
      id: 4,
      user: "Sarah Lee",
      action: "added new items",
      time: "5 hours ago",
    },
    { id: 5, user: "Alex Chen", action: "completed a task", time: "Yesterday" },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your admin dashboard. Here's what's happening today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Statistic Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#e3f2fd",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              1,285
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +12.5%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
            >
              <PeopleAltIcon sx={{ fontSize: 60 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#c8e6c9",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Tasks Completed
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              824
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +8.2%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last week
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
            >
              <TaskAltIcon sx={{ fontSize: 60 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#fff9c4",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Items
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              452
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +5.3%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
            <Box
              sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1 }}
            >
              <ShoppingBagIcon sx={{ fontSize: 60 }} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              position: "relative",
              backgroundColor: "#ffe0b2",
              borderRadius: 2,
            }}
          >
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <IconButton size="small">
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h4" sx={{ my: 1, fontWeight: 600 }}>
              $28,450
            </Typography>
            <Box sx={{ mt: "auto", display: "flex", alignItems: "center" }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +16.8%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Since last month
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Activity Overview</Typography>
              <Button size="small" variant="outlined">
                View Details
              </Button>
            </Box>
            <SimpleLineChart />
            <ChartFooter />
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Recent Activities</Typography>
              <Button size="small" variant="text">
                View All
              </Button>
            </Box>
            <Stack spacing={2} divider={<Divider flexItem />}>
              {recentActivities.map((activity) => (
                <Box key={activity.id}>
                  <Typography variant="body2" fontWeight={500}>
                    {activity.user}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
