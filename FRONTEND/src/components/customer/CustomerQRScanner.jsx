import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { injectQRScannerStyles } from "./QRScannerStyles";
import EventSelector from "./EventSelector";
import QRScanner from "./QRScanner";
import ScannedUsersList from "./ScannedUsersList";
import HowItWorks from "./HowItWorks";
import ManualAddDialog from "./ManualAddDialog";

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
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scannedUsers, setScannedUsers] = useState(SAMPLE_SCANNED_USERS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [manualAddOpen, setManualAddOpen] = useState(false);
  const [manualUser, setManualUser] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    injectQRScannerStyles();
  }, []);

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleStopScan = () => {
    setScanning(false);
    setLoading(false);
  };

  const handleScanResult = (result) => {
    setResult(result);
    setScanning(false);
    // Handle the scanned result here
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

    const newUser = {
      id: Math.floor(Math.random() * 1000),
      name: manualUser.name,
      email: manualUser.email,
      avatar: `https://mui.com/static/images/avatar/${
        Math.floor(Math.random() * 8) + 1
      }.jpg`,
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

  return (
    <Box className="customer-content-container">
      <Box className="customer-section">
        <Typography className="customer-section-title">
          QR Code Scanner
        </Typography>
        <Typography paragraph>
          <br />
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
              <EventSelector
                selectedEvent={selectedEvent}
                onEventChange={handleEventChange}
              />

              <Typography variant="h6" gutterBottom>
                2. Scan QR Code
              </Typography>
              <QRScanner
                scanning={scanning}
                loading={loading}
                onStopScan={handleStopScan}
                onScanResult={handleScanResult}
              />

              {!selectedEvent && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Please select an event before scanning
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  className="customer-button-secondary"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setManualAddOpen(true)}
                >
                  Add Manually
                </Button>
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
              <ScannedUsersList
                scannedUsers={scannedUsers}
                onRemoveUser={handleRemoveUser}
              />
            </Paper>
          </Grid>
        </Grid>

        <HowItWorks />
      </Box>

      <ManualAddDialog
        open={manualAddOpen}
        onClose={() => setManualAddOpen(false)}
        manualUser={manualUser}
        onManualInputChange={handleManualInputChange}
        onManualAdd={handleManualAdd}
        selectedEvent={selectedEvent}
      />

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
