import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Avatar,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Chip,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DoneIcon from "@mui/icons-material/Done";
import EventIcon from "@mui/icons-material/Event";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

// Sample events for dropdown selection
const EVENTS = [
  {
    id: 1,
    name: "Tree Planting Initiative",
    date: "2023-06-15",
    location: "City Park",
  },
  {
    id: 2,
    name: "Beach Clean-up Drive",
    date: "2023-07-22",
    location: "West Coast Beach",
  },
  {
    id: 3,
    name: "Tech Innovation Fair",
    date: "2023-08-10",
    location: "Convention Center",
  },
  {
    id: 4,
    name: "Renewable Energy Workshop",
    date: "2023-09-05",
    location: "Community Center",
  },
  {
    id: 5,
    name: "Wildlife Conservation Talk",
    date: "2023-05-20",
    location: "City Library",
  },
  {
    id: 6,
    name: "Sustainable Fashion Show",
    date: "2023-04-12",
    location: "Arts Center",
  },
];

// Sample scanned users (would come from actual QR scans in a real app)
const SAMPLE_SCANNED_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    scannedAt: "2023-08-10T14:32:15",
    eventId: 3,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    scannedAt: "2023-08-10T14:35:22",
    eventId: 3,
  },
];

export default function CustomerQRScanner() {
  const userInfo = useOutletContext();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUsers, setScannedUsers] = useState(SAMPLE_SCANNED_USERS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [manualUser, setManualUser] = useState({
    name: "",
    email: "",
  });

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleStartScanning = () => {
    if (!selectedEvent) {
      setSuccessMessage("Please select an event first");
      setShowSuccess(true);
      return;
    }
    setIsScanning(true);
    // In a real app, this would activate the camera and QR scanner
  };

  const handleStopScanning = () => {
    setIsScanning(false);
  };

  const handleManualInputChange = (event) => {
    setManualUser({
      ...manualUser,
      [event.target.name]: event.target.value,
    });
  };

  const handleManualAdd = () => {
    if (!selectedEvent) {
      setSuccessMessage("Please select an event first");
      setShowSuccess(true);
      setManualAddOpen(false);
      return;
    }

    // In a real app, this would validate the user and add them to the event
    const newUser = {
      id: Math.floor(Math.random() * 1000), // Just for demo
      name: manualUser.name,
      email: manualUser.email,
      avatar: `https://mui.com/static/images/avatar/${
        Math.floor(Math.random() * 8) + 1
      }.jpg`, // Random avatar for demo
      scannedAt: new Date().toISOString(),
      eventId: selectedEvent,
    };

    setScannedUsers([newUser, ...scannedUsers]);
    setManualAddOpen(false);
    setManualUser({ name: "", email: "" });
    setSuccessMessage(`${manualUser.name} has been added to the event`);
    setShowSuccess(true);
  };

  const handleRemoveUser = (userId) => {
    setScannedUsers(scannedUsers.filter((user) => user.id !== userId));
  };

  const getEventNameById = (eventId) => {
    const event = EVENTS.find((e) => e.id === eventId);
    return event ? event.name : "Unknown Event";
  };

  return (
    <Box className="customer-content-container">
      <Box className="customer-section">
        <Typography className="customer-section-title">
          QR Code Scanner
        </Typography>
        <Typography paragraph>
          Scan QR codes to add users to events. Select an event and start
          scanning, or add users manually.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid var(--light-green)",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                1. Select an Event
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="event-select-label">Event</InputLabel>
                <Select
                  labelId="event-select-label"
                  id="event-select"
                  value={selectedEvent}
                  label="Event"
                  onChange={handleEventChange}
                >
                  {EVENTS.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" gutterBottom>
                2. Scan QR Code
              </Typography>
              <Box className="customer-qr-scanner-container">
                <Box className="customer-qr-preview">
                  {isScanning ? (
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {/* This would be the actual camera view in a real app */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0,0,0,0.1)",
                          flexDirection: "column",
                        }}
                      >
                        <QrCodeScannerIcon
                          sx={{ fontSize: 60, color: "var(--primary-green)" }}
                        />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                          Scanning...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Hold QR code in front of the camera
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
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
                      <Typography>Click "Start Scanning" to begin</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Camera will activate when scanning starts
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {!isScanning ? (
                    <Button
                      className="customer-button"
                      startIcon={<QrCodeScannerIcon />}
                      onClick={handleStartScanning}
                      disabled={!selectedEvent}
                    >
                      Start Scanning
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleStopScanning}
                    >
                      Stop Scanning
                    </Button>
                  )}

                  <Button
                    className="customer-button-secondary"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setManualAddOpen(true)}
                  >
                    Add Manually
                  </Button>
                </Box>

                {!selectedEvent && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Please select an event before scanning
                  </Alert>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: "100%",
                border: "1px solid var(--light-green)",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <VerifiedUserIcon
                  sx={{ mr: 1, color: "var(--primary-green)" }}
                />
                Recently Scanned Users
              </Typography>

              {scannedUsers.length > 0 ? (
                <List
                  sx={{
                    bgcolor: "background.paper",
                    overflow: "auto",
                    flex: 1,
                    maxHeight: 400,
                  }}
                >
                  {scannedUsers.map((user) => (
                    <ListItem
                      key={user.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveUser(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      sx={{
                        mb: 1,
                        backgroundColor: "var(--grey-100)",
                        borderRadius: 1,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={user.avatar} alt={user.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {user.email}
                            </Typography>
                            <Box
                              sx={{
                                mt: 0.5,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Chip
                                size="small"
                                icon={<EventIcon style={{ fontSize: 14 }} />}
                                label={getEventNameById(user.eventId)}
                                sx={{ height: 24, fontSize: "0.75rem" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(user.scannedAt).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 5,
                    flex: 1,
                  }}
                >
                  <PersonAddIcon
                    sx={{ fontSize: 40, color: "var(--text-light)", mb: 1 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    No users scanned yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start scanning or add users manually
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: "var(--light-green)",
                        color: "var(--primary-green)",
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontWeight: "bold",
                      }}
                    >
                      1
                    </Box>
                    <Typography variant="h6">Select an Event</Typography>
                  </Box>
                  <Typography variant="body2">
                    Choose the event that participants will be joining. This
                    ensures users are added to the correct event.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: "var(--light-green)",
                        color: "var(--primary-green)",
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontWeight: "bold",
                      }}
                    >
                      2
                    </Box>
                    <Typography variant="h6">Scan User QR Code</Typography>
                  </Box>
                  <Typography variant="body2">
                    Ask participants to show their unique QR code from their
                    user profile or event registration email.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Box
                      sx={{
                        bgcolor: "var(--light-green)",
                        color: "var(--primary-green)",
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontWeight: "bold",
                      }}
                    >
                      3
                    </Box>
                    <Typography variant="h6">Confirm Attendance</Typography>
                  </Box>
                  <Typography variant="body2">
                    The system automatically registers the user to the event.
                    You can view and manage all participants in the User
                    Management section.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Manual Add Dialog */}
      <Dialog
        open={manualAddOpen}
        onClose={() => setManualAddOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add User Manually</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="name"
                value={manualUser.name}
                onChange={handleManualInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={manualUser.email}
                onChange={handleManualInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                The user will be added to:{" "}
                {selectedEvent
                  ? getEventNameById(selectedEvent)
                  : "No event selected"}
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManualAddOpen(false)}>Cancel</Button>
          <Button
            className="customer-button"
            onClick={handleManualAdd}
            disabled={!manualUser.name || !manualUser.email}
            startIcon={<PersonAddIcon />}
          >
            Add to Event
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
