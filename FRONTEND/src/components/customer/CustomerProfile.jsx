import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  Skeleton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Badge,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import HistoryIcon from "@mui/icons-material/History";
import SaveIcon from "@mui/icons-material/Save";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CancelIcon from "@mui/icons-material/Cancel";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useOutletContext } from "react-router-dom";
import { useNotification } from "../../components/ui/NotificationProvider";
import {
  getUserApi,
  updateUserApi,
  uploadUserAvatarApi,
  getBuyerTransactionHistory,
  getQRApi,
  logoutUserApi,
} from "../../utils/api";
import getAmount from "../../utils/getAmount";

export default function CustomerProfile() {
  const userInfo = useOutletContext();
  const { notify } = useNotification();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    username: "",
  });

  // Fetch the latest user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUserData(true);
      try {
        const response = await getUserApi();
        if (response?.data) {
          setUserData(response.data);
          setFormData({
            full_name: response.data.full_name || "",
            email: response.data.email || "",
            phone_number: response.data.phone_number || "",
            username: response.data.username || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notify("error", "Could not fetch user data. Please try again later.");
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [notify]);

  useEffect(() => {
    if (tabValue === 1 && userInfo?.id) {
      const fetchTransactions = async () => {
        setLoadingTransactions(true);
        try {
          const response = await getBuyerTransactionHistory(userInfo.id);
          if (response?.data) {
            setTransactions(response.data);
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
          notify("error", "Could not fetch transaction history.");
        } finally {
          setLoadingTransactions(false);
        }
      };

      fetchTransactions();
    }
  }, [tabValue, userInfo?.id, notify]);

  const generateQRCode = async () => {
    try {
      console.log("check user info", userInfo);
      const response = await getQRApi(userInfo?.public_id || "");
      console.log("check qr res", response);
      if (response?.data) {
        setQrCode(response.data);
        setShowQrDialog(true);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      notify("error", "Could not generate QR code. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUserApi(userInfo?.id, formData);
      if (response?.data) {
        notify("success", "Profile updated successfully!");
        setEditMode(false);
        // Update user data
        setUserData({ ...userData, ...formData });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notify("error", "Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      notify("error", "Please select an image file");
      return;
    }

    setAvatarUploading(true);
    try {
      const response = await uploadUserAvatarApi(userInfo?.id, file);
      if (response?.data) {
        notify("success", "Profile picture updated successfully!");
        // Force a page refresh to update the avatar across the app
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notify(
        "error",
        "Failed to upload profile picture. Please try again later."
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify("success", "Copied to clipboard!");
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUserApi();
      if (response?.success) {
        notify("success", "Đăng xuất thành công");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      notify("error", "Failed to log out. Please try again.");
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loadingUserData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box className="customer-content-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card
            className="customer-card"
            sx={{
              position: "relative",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: 120,
                background:
                  "linear-gradient(135deg, var(--primary-green) 0%, #2E7D32 100%)",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                position: "relative",
              }}
            >
              <IconButton
                color="inherit"
                aria-label="more options"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: -6,
                mb: 2,
                position: "relative",
              }}
            >
              {avatarUploading ? (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "4px solid white",
                  }}
                >
                  <CircularProgress size={40} color="success" />
                </Box>
              ) : (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        backgroundColor: "white",
                        border: "2px solid var(--light-green)",
                        "&:hover": {
                          backgroundColor: "var(--light-green)",
                        },
                      }}
                      size="small"
                    >
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  }
                >
                  <Avatar
                    src={userInfo?.avatar_url}
                    alt={userInfo?.full_name}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid white",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                </Badge>
              )}
            </Box>

            <CardContent sx={{ pt: 0, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">
                {userData?.full_name || "Customer"}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{userData?.username || "username"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  my: 2,
                  p: 1.5,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, var(--light-green) 0%, #E8F5E9 100%)",
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                }}
              >
                <MonetizationOnIcon color="success" />
                <Typography
                  variant="h6"
                  color="var(--primary-green)"
                  fontWeight="bold"
                >
                  {getAmount(userData?.coins)} Coins
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="success"
                fullWidth
                onClick={generateQRCode}
                startIcon={<QrCodeIcon />}
                sx={{
                  mb: 2,
                  borderRadius: "8px",
                  p: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Show QR Code
              </Button>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <EmailIcon
                    fontSize="small"
                    sx={{ color: "var(--primary-green)", mr: 1.5 }}
                  />
                  <Typography variant="body2">
                    {userData?.email || "Email not set"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <PhoneIcon
                    fontSize="small"
                    sx={{ color: "var(--primary-green)", mr: 1.5 }}
                  />
                  <Typography variant="body2">
                    {userData?.phone_number || "Phone not set"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CalendarTodayIcon
                    fontSize="small"
                    sx={{ color: "var(--primary-green)", mr: 1.5 }}
                  />
                  <Typography variant="body2">
                    Joined:{" "}
                    {userData?.last_logined
                      ? new Date(userData.last_logined).toLocaleDateString()
                      : "Unknown"}
                  </Typography>
                </Box>

                {userData?.role && (
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1.5 }}>
                    <VerifiedUserIcon
                      fontSize="small"
                      sx={{ color: "var(--primary-green)", mr: 1.5 }}
                    />
                    <Chip
                      size="small"
                      label={userData.role}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card
            className="customer-card"
            sx={{
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTabs-indicator": {
                      backgroundColor: "var(--primary-green)",
                    },
                    "& .MuiTab-root.Mui-selected": {
                      color: "var(--primary-green)",
                    },
                  }}
                >
                  <Tab icon={<AccountCircleIcon />} label="Profile" />
                  {/* <Tab icon={<HistoryIcon />} label="Transaction History" /> */}
                </Tabs>

                {tabValue === 0 &&
                  (editMode ? (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditMode(false);
                          // Reset form data to current user data
                          setFormData({
                            full_name: userData?.full_name || "",
                            email: userData?.email || "",
                            phone_number: userData?.phone_number || "",
                            username: userData?.username || "",
                          });
                        }}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                        }}
                      >
                        {loading ? <CircularProgress size={24} /> : "Save"}
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      color="success"
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      Edit Profile
                    </Button>
                  ))}
              </Box>

              <Divider sx={{ mb: 3 }} />

              {tabValue === 0 && (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon
                                color={editMode ? "success" : "disabled"}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "var(--primary-green)",
                            },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "var(--primary-green)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon
                                color={editMode ? "success" : "disabled"}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "var(--primary-green)",
                            },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "var(--primary-green)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon
                                color={editMode ? "success" : "disabled"}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "var(--primary-green)",
                            },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "var(--primary-green)",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon
                                color={editMode ? "success" : "disabled"}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "var(--primary-green)",
                            },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "var(--primary-green)",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </form>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Transaction History
                  </Typography>

                  {loadingTransactions ? (
                    [...Array(5)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid #eee",
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        <Skeleton animation="wave" height={30} width="60%" />
                        <Skeleton animation="wave" height={20} width="40%" />
                        <Skeleton animation="wave" height={20} width="30%" />
                      </Box>
                    ))
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction) => {
                      const transactionAmount = getAmount(transaction.amount);
                      return (
                        <Box
                          key={transaction.id}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: "12px",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                            border: "1px solid #eee",
                            "&:hover": {
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                              borderColor: "var(--light-green)",
                              bgcolor: "rgba(46, 125, 50, 0.02)",
                              transition: "all 0.2s ease-in-out",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography variant="subtitle1" fontWeight="bold">
                                {transaction.type === "PURCHASE"
                                  ? "Item Purchase"
                                  : transaction.type === "REWARD"
                                  ? "Reward Received"
                                  : "Transaction"}
                              </Typography>
                              <Chip
                                size="small"
                                label={transaction.type}
                                color={
                                  transactionAmount > 0 ? "success" : "error"
                                }
                                variant="outlined"
                                sx={{ height: "20px" }}
                              />
                            </Box>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              color={
                                transactionAmount > 0
                                  ? "success.main"
                                  : "error.main"
                              }
                            >
                              {transactionAmount > 0
                                ? `+${transactionAmount}`
                                : transactionAmount}{" "}
                              Coins
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.description ||
                              "No description provided"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(transaction.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                      );
                    })
                  ) : (
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "rgba(46, 125, 50, 0.08)",
                      }}
                    >
                      No transaction history found.
                    </Alert>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QR Code Dialog */}
      <Dialog
        open={showQrDialog}
        onClose={() => setShowQrDialog(false)}
        aria-labelledby="qr-code-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          id="qr-code-dialog-title"
          sx={{
            bgcolor: "var(--light-green)",
            color: "var(--primary-green)",
            fontWeight: "bold",
          }}
        >
          Your Personal QR Code
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 2 }}>
            Scan this QR code to quickly access your profile or register for
            events.
          </DialogContentText>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              my: 2,
              p: 3,
              border: "2px dashed var(--light-green)",
              borderRadius: "12px",
              bgcolor: "rgba(46, 125, 50, 0.02)",
            }}
          >
            {qrCode ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src={qrCode}
                  alt="QR Code"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    cursor: "pointer",
                    color: "var(--primary-green)",
                    bgcolor: "var(--light-green)",
                    p: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: "rgba(46, 125, 50, 0.2)",
                    },
                  }}
                  onClick={() => copyToClipboard(userInfo?.public_id)}
                >
                  <Typography variant="body2" fontWeight="medium">
                    Public ID: {userInfo?.public_id}
                  </Typography>
                  <Tooltip title="Copy ID">
                    <ContentCopyIcon fontSize="small" />
                  </Tooltip>
                </Box>
              </Box>
            ) : (
              <CircularProgress color="success" />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setShowQrDialog(false)}
            color="success"
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontWeight: "bold",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
