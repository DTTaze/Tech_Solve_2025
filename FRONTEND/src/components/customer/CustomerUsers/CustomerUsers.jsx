import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import {
  getOwnerEventApi,
  getEventUserByEventIdApi,
  getUserAvatarByIdApi,
  deleteEventUserByIdApi,
} from "../../../utils/api";
import UserFilters from "./UserFilters";
import UserList from "./UserList";

export default function CustomerUsers() {
  const userInfo = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    eventId: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null,
    eventId: null,
    eventUser: null,
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchEventUsers = async (eventId) => {
    try {
      const usersResponse = await getEventUserByEventIdApi(eventId);
      return usersResponse.data;
    } catch (error) {
      console.error(`Error fetching users for event ${eventId}:`, error);
      return []; // Return empty array if there's an error
    }
  };

  const fetchUserData = async (eventUser) => {
    try {
      const userData = eventUser.User;
      const avatarResponse = await getUserAvatarByIdApi(eventUser.user_id);
      const avatarData = avatarResponse.data;

      return {
        id: eventUser.user_id,
        full_name: userData.full_name,
        email: userData.email,
        avatar: avatarData?.avatar_url || "/placeholder-avatar.jpg",
        coins: userData.coins || 0,
        events: [
          {
            id: eventUser.event_id,
            title: eventUser.Event.title,
            status: eventUser.Event.status,
            completion_rate: !eventUser.joined_at
              ? 0
              : eventUser.completed_at
              ? 100
              : 50,
            eventUser: eventUser,
          },
        ],
      };
    } catch (error) {
      console.error(
        `Error fetching user data for user ${eventUser.user_id}:`,
        error
      );
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch events owned by the current user
        const eventsResponse = await getOwnerEventApi();
        const eventsData = eventsResponse.data;
        setEvents(eventsData);

        // Fetch users for each event
        const allUsers = new Map(); // Use Map to avoid duplicates
        for (const event of eventsData) {
          const eventUsers = await fetchEventUsers(event.id);

          for (const eventUser of eventUsers) {
            if (!allUsers.has(eventUser.user_id)) {
              const userData = await fetchUserData(eventUser);
              if (userData) {
                allUsers.set(eventUser.user_id, userData);
              }
            } else {
              // Add event to existing user
              const existingUser = allUsers.get(eventUser.user_id);
              const userData = await fetchUserData(eventUser);
              if (userData) {
                existingUser.events.push(userData.events[0]);
              }
            }
          }
        }

        setUsers(Array.from(allUsers.values()));
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.id) {
      fetchData();
    }
  }, [userInfo, refreshTrigger]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      eventId: "",
    });
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRemoveUser = (user, eventId, eventUser) => {
    setDeleteDialog({
      open: true,
      user,
      eventId,
      eventUser,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEventUserByIdApi(deleteDialog.eventUser.id);

      // Close dialog first
      setDeleteDialog({
        open: false,
        user: null,
        eventId: null,
        eventUser: null,
      });

      // Trigger refresh to fetch updated data
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      setError(error.message || "Failed to remove user from event");
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      user: null,
      eventId: null,
      eventUser: null,
    });
  };

  // Filter users based on search term and selected event
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());

    const matchesEvent =
      !filters.eventId ||
      user.events.some((event) => event.id === parseInt(filters.eventId));

    return matchesSearch && matchesEvent;
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="customer-content-container">
      <Box className="customer-section">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Typography className="customer-section-title">
            Event Participants
          </Typography>
        </Box>

        <UserFilters
          events={events}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        <UserList
          users={filteredUsers}
          onRemoveUser={handleRemoveUser}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        <Dialog
          open={deleteDialog.open}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Remove Participant</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove {deleteDialog.user?.full_name}{" "}
              from{" "}
              {deleteDialog.user?.events.find(
                (e) => e.id === deleteDialog.eventId
              )?.title || "this event"}
              ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
