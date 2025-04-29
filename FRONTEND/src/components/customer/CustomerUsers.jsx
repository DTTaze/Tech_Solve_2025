import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  InputAdornment,
  Slider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TablePagination,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import GroupIcon from "@mui/icons-material/Group";
import EventIcon from "@mui/icons-material/Event";
import StarIcon from "@mui/icons-material/Star";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

// Sample data for users
const SAMPLE_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    phone: "+1 (555) 123-4567",
    events: [
      {
        id: 1,
        name: "Tree Planting Initiative",
        status: "completed",
        completionRate: 90,
      },
      {
        id: 3,
        name: "Tech Innovation Fair",
        status: "active",
        completionRate: 60,
      },
    ],
    coins: 520,
    status: "active",
    totalEventsJoined: 4,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    phone: "+1 (555) 987-6543",
    events: [
      {
        id: 2,
        name: "Beach Clean-up Drive",
        status: "completed",
        completionRate: 100,
      },
      {
        id: 4,
        name: "Renewable Energy Workshop",
        status: "active",
        completionRate: 40,
      },
    ],
    coins: 780,
    status: "active",
    totalEventsJoined: 5,
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    phone: "+1 (555) 456-7890",
    events: [
      {
        id: 1,
        name: "Tree Planting Initiative",
        status: "completed",
        completionRate: 70,
      },
      {
        id: 2,
        name: "Beach Clean-up Drive",
        status: "completed",
        completionRate: 85,
      },
    ],
    coins: 350,
    status: "inactive",
    totalEventsJoined: 2,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    avatar: "https://mui.com/static/images/avatar/4.jpg",
    phone: "+1 (555) 789-0123",
    events: [
      {
        id: 3,
        name: "Tech Innovation Fair",
        status: "active",
        completionRate: 20,
      },
    ],
    coins: 150,
    status: "active",
    totalEventsJoined: 1,
  },
  {
    id: 5,
    name: "Michael Wang",
    email: "michael.wang@example.com",
    avatar: "https://mui.com/static/images/avatar/5.jpg",
    phone: "+1 (555) 234-5678",
    events: [
      {
        id: 1,
        name: "Tree Planting Initiative",
        status: "completed",
        completionRate: 95,
      },
      {
        id: 2,
        name: "Beach Clean-up Drive",
        status: "completed",
        completionRate: 90,
      },
      {
        id: 3,
        name: "Tech Innovation Fair",
        status: "active",
        completionRate: 75,
      },
    ],
    coins: 890,
    status: "active",
    totalEventsJoined: 6,
  },
];

// Sample events for selection
const EVENTS = [
  { id: 1, name: "Tree Planting Initiative" },
  { id: 2, name: "Beach Clean-up Drive" },
  { id: 3, name: "Tech Innovation Fair" },
  { id: 4, name: "Renewable Energy Workshop" },
  { id: 5, name: "Wildlife Conservation Talk" },
  { id: 6, name: "Sustainable Fashion Show" },
];

export default function CustomerUsers() {
  const userInfo = useOutletContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [evaluateOpen, setEvaluateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [completionRate, setCompletionRate] = useState(50);
  const [coinsToAward, setCoinsToAward] = useState(0);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [scannerDialogOpen, setScannerDialogOpen] = useState(false);
  const [userToEvent, setUserToEvent] = useState({
    userId: "",
    eventId: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter users based on search term and tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      tabValue === 0 ||
      (tabValue === 1 && user.status === "active") ||
      (tabValue === 2 && user.status === "inactive");

    return matchesSearch && matchesTab;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenEvaluateDialog = (user, eventId) => {
    const event = user.events.find((e) => e.id === eventId);
    setSelectedUser(user);
    setSelectedEvent(event);
    setCompletionRate(event ? event.completionRate : 50);
    setCoinsToAward(Math.round(event ? event.completionRate * 2 : 100));
    setEvaluateOpen(true);
  };

  const handleCloseEvaluateDialog = () => {
    setEvaluateOpen(false);
    setSelectedUser(null);
    setSelectedEvent(null);
  };

  const handleCompletionRateChange = (event, newValue) => {
    setCompletionRate(newValue);
    setCoinsToAward(Math.round(newValue * 2)); // Simple calculation based on completion rate
  };

  const handleAwardCoins = () => {
    // Here would go the logic to save evaluation to backend
    // Update user coins locally for demo
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const updatedEvents = user.events.map((event) => {
          if (event.id === selectedEvent.id) {
            return { ...event, completionRate: completionRate };
          }
          return event;
        });
        return {
          ...user,
          events: updatedEvents,
          coins: user.coins + coinsToAward,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    handleCloseEvaluateDialog();
  };

  const handleOpenScannerDialog = () => {
    setScannerDialogOpen(true);
  };

  const handleCloseScannerDialog = () => {
    setScannerDialogOpen(false);
  };

  const handleUserToEventChange = (event) => {
    setUserToEvent({
      ...userToEvent,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddUserToEvent = () => {
    // Logic to add user to event would go here in a real app
    // For demo, just close the dialog
    setScannerDialogOpen(false);
    setUserToEvent({
      userId: "",
      eventId: "",
    });
  };

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
            User Management
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              className="customer-button-secondary"
              startIcon={<QrCodeScannerIcon />}
              onClick={handleOpenScannerDialog}
            >
              Scan QR
            </Button>
            <Button
              className="customer-button"
              startIcon={<AddIcon />}
              onClick={() => setAddUserOpen(true)}
            >
              Add User
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 3,
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: { md: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            size="small"
            sx={{
              borderColor: "var(--light-green)",
              color: "var(--primary-green)",
              "&:hover": {
                borderColor: "var(--primary-green)",
                backgroundColor: "rgba(46, 125, 50, 0.08)",
              },
            }}
          >
            Filters
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--primary-green)",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "var(--primary-green)",
            },
          }}
        >
          <Tab label="All Users" />
          <Tab label="Active" />
          <Tab label="Inactive" />
        </Tabs>

        {!isMobile ? (
          <TableContainer component={Paper} className="customer-table">
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Events</TableCell>
                  <TableCell align="center">Total Events</TableCell>
                  <TableCell align="center">Coins</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar src={user.avatar} alt={user.name} />
                          <Typography sx={{ fontWeight: 500 }}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <EmailIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {user.email}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <PhoneIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {user.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          {user.events.map((event) => (
                            <Box
                              key={event.id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1,
                                backgroundColor: "var(--grey-100)",
                                borderRadius: 1,
                                border: "1px solid var(--grey-200)",
                              }}
                            >
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {event.name}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <Chip
                                    label={event.status}
                                    size="small"
                                    color={
                                      event.status === "completed"
                                        ? "success"
                                        : "info"
                                    }
                                    sx={{ height: 20, fontSize: "0.7rem" }}
                                  />
                                  <Typography variant="caption">
                                    {event.completionRate}% completed
                                  </Typography>
                                </Box>
                              </Box>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  handleOpenEvaluateDialog(user, event.id)
                                }
                                sx={{
                                  minWidth: 0,
                                  p: "4px",
                                  color: "var(--primary-green)",
                                  borderColor: "var(--light-green)",
                                }}
                              >
                                <StarIcon fontSize="small" />
                              </Button>
                            </Box>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        {user.totalEventsJoined}
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          <MonetizationOnIcon
                            color="warning"
                            fontSize="small"
                          />
                          <Typography fontWeight={500}>{user.coins}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={
                            user.status === "active" ? "success" : "default"
                          }
                          sx={{ textTransform: "capitalize" }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleOpenScannerDialog()}
                          sx={{
                            bgcolor: "var(--primary-green)",
                            "&:hover": {
                              bgcolor: "var(--dark-green)",
                            },
                          }}
                        >
                          Add to Event
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        No users found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        ) : (
          // Mobile view with cards
          <Grid container spacing={2}>
            {filteredUsers.map((user) => (
              <Grid item xs={12} key={user.id}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        sx={{ width: 60, height: 60 }}
                      />
                      <Box>
                        <Typography variant="h6">{user.name}</Typography>
                        <Chip
                          label={user.status}
                          size="small"
                          color={
                            user.status === "active" ? "success" : "default"
                          }
                          sx={{ textTransform: "capitalize", mt: 0.5 }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body2">{user.email}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body2">{user.phone}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Total Events
                        </Typography>
                        <Typography variant="body2">
                          {user.totalEventsJoined}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Coins
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <MonetizationOnIcon
                            color="warning"
                            fontSize="small"
                          />
                          <Typography fontWeight={500}>{user.coins}</Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                      Events
                    </Typography>
                    <Stack spacing={1}>
                      {user.events.map((event) => (
                        <Box
                          key={event.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1,
                            backgroundColor: "var(--grey-100)",
                            borderRadius: 1,
                            border: "1px solid var(--grey-200)",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {event.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Chip
                                label={event.status}
                                size="small"
                                color={
                                  event.status === "completed"
                                    ? "success"
                                    : "info"
                                }
                                sx={{ height: 20, fontSize: "0.7rem" }}
                              />
                              <Typography variant="caption">
                                {event.completionRate}% completed
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleOpenEvaluateDialog(user, event.id)
                            }
                            sx={{
                              minWidth: 0,
                              p: "4px",
                              color: "var(--primary-green)",
                              borderColor: "var(--light-green)",
                            }}
                          >
                            <StarIcon fontSize="small" />
                          </Button>
                        </Box>
                      ))}
                    </Stack>

                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenScannerDialog()}
                        sx={{
                          bgcolor: "var(--primary-green)",
                          "&:hover": {
                            bgcolor: "var(--dark-green)",
                          },
                        }}
                      >
                        Add to Event
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {filteredUsers.length === 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                    backgroundColor: "var(--grey-100)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search or filters
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* Evaluate User Dialog */}
      <Dialog
        open={evaluateOpen}
        onClose={handleCloseEvaluateDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Evaluate User Participation</DialogTitle>
        <DialogContent dividers>
          {selectedUser && selectedEvent && (
            <Box className="user-evaluation-form">
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Avatar
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  sx={{ width: 50, height: 50 }}
                />
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <EventIcon color="primary" />
                  <Typography variant="subtitle1">
                    {selectedEvent.name}
                  </Typography>
                </Box>
                <Chip
                  label={selectedEvent.status}
                  size="small"
                  color={
                    selectedEvent.status === "completed" ? "success" : "info"
                  }
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task Completion Rate
                </Typography>
                <Slider
                  value={completionRate}
                  onChange={handleCompletionRateChange}
                  aria-labelledby="completion-rate-slider"
                  valueLabelDisplay="on"
                  step={5}
                  marks
                  min={0}
                  max={100}
                  className="evaluation-slider"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Event Participation Rating
                </Typography>
                <Rating
                  name="participation-rating"
                  value={completionRate / 20}
                  precision={0.5}
                  onChange={(event, newValue) => {
                    setCompletionRate(newValue * 20);
                    setCoinsToAward(Math.round(newValue * 40));
                  }}
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "var(--primary-green)",
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  p: 2,
                  backgroundColor: "var(--light-green)",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle2">Coins to Award</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on completion rate
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    type="number"
                    size="small"
                    value={coinsToAward}
                    onChange={(e) => setCoinsToAward(Number(e.target.value))}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MonetizationOnIcon color="warning" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 120 }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEvaluateDialog}>Cancel</Button>
          <Button
            className="customer-button"
            onClick={handleAwardCoins}
            startIcon={<VerifiedUserIcon />}
          >
            Submit Evaluation
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Scanner Dialog */}
      <Dialog
        open={scannerDialogOpen}
        onClose={handleCloseScannerDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <QrCodeScannerIcon />
            Scan QR or Add User to Event
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Scan User QR Code
            </Typography>
            <Box className="customer-qr-scanner-container">
              <Box className="customer-qr-preview" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "var(--text-light)",
                    textAlign: "center",
                  }}
                >
                  <QrCodeScannerIcon
                    sx={{ fontSize: 40, mb: 1, opacity: 0.5 }}
                  />
                  <Typography>Camera preview will appear here</Typography>
                  <Typography variant="body2" color="text.secondary">
                    (QR scanning functionality would be implemented here)
                  </Typography>
                </Box>
              </Box>
              <Button
                className="customer-button"
                startIcon={<QrCodeScannerIcon />}
              >
                Start Scanning
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Manually Add User to Event
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select User</InputLabel>
                  <Select
                    name="userId"
                    value={userToEvent.userId}
                    label="Select User"
                    onChange={handleUserToEventChange}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Select Event</InputLabel>
                  <Select
                    name="eventId"
                    value={userToEvent.eventId}
                    label="Select Event"
                    onChange={handleUserToEventChange}
                  >
                    {EVENTS.map((event) => (
                      <MenuItem key={event.id} value={event.id}>
                        {event.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScannerDialog}>Cancel</Button>
          <Button
            className="customer-button"
            onClick={handleAddUserToEvent}
            disabled={!userToEvent.userId || !userToEvent.eventId}
          >
            Add to Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
