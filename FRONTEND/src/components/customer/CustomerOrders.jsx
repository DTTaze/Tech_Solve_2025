import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimelineIcon from "@mui/icons-material/Timeline";
import EditIcon from "@mui/icons-material/Edit";

// Import extracted components
import OrdersList from "./orders/OrdersList";
import EmptyOrderState from "./orders/EmptyOrderState";
import CreateOrderForm from "./orders/forms/CreateOrderForm";
import AddShippingAccountForm from "./orders/forms/AddShippingAccountForm";
import ShippingAccountsList from "./orders/ShippingAccountsList";
import OrderDetailsDialog from "./orders/dialogs/OrderDetailsDialog";
import OrderTrackingDialog from "./orders/dialogs/OrderTrackingDialog";

// Import mock data and utilities
import {
  mockOrders,
  wasteCategories,
  wasteTypesMap,
} from "../../data/ordersMockData";

import {
  createShippingOrderApi,
  getShippingOrderDetailApi,
  updateShippingOrderApi,
  cancelShippingOrderApi,
  getShippingAccountsByUserApi,
  createShippingAccountApi,
  updateShippingAccountApi,
  deleteShippingAccountApi,
  setDefaultShippingAccountApi,
} from "../../utils/api";

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Pending Confirmation":
      return "info";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

const emptyShippingAccountForm = {
  name: "",
  shop_id: "",
  token: "",
  carrier: "",
  is_default: false,
};

export default function CustomerOrders() {
  const userInfo = useOutletContext();
  const [orders, setOrders] = useState(mockOrders);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [shippingAccountsDialogOpen, setShippingAccountsDialogOpen] =
    useState(false);
  const [addShippingAccountDialogOpen, setAddShippingAccountDialogOpen] =
    useState(false);
  const [buyerInfoDialogOpen, setBuyerInfoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedShippingAccount, setSelectedShippingAccount] = useState(null);
  const [isEditingShippingAccount, setIsEditingShippingAccount] =
    useState(false);
  const [newOrder, setNewOrder] = useState({
    senderPhone: "",
    senderAddress: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverName: "",
    receiverDistrict: "",
    receiverWard: "",
    productName: "Áo Polo",
    productWeight: "1,200",
    productQuantity: "1",
    productCode: "Polo123",
    packageWeight: "200",
    packageLength: "1",
    packageWidth: "19",
    packageHeight: "10",
    packageVolumeWeight: "76",
    codAmount: "200000",
    totalValue: "100000",
    cashOnDeliveryFailure: false,
    failureCharge: "0",
    customerOrderCode: "",
    deliveryNote: "no_view",
    notes: "Tintest 123",
    servicePackage: "light",
    pickupOption: "pickup",
    pickupLocation: "",
    packages: [],
    paymentParty: "receiver",
    promotionCode: "",
  });
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [newShippingAccount, setNewShippingAccount] = useState(
    emptyShippingAccountForm
  );
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [shippingAccounts, setShippingAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch shipping accounts on component mount
  useEffect(() => {
    fetchShippingAccounts();
    fetchOrders();
  }, []);

  const fetchShippingAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      setErrorMessage("");

      const response = await getShippingAccountsByUserApi();
      console.log("check newShippingAccount", newShippingAccount);
      if (response && response.data) {
        setShippingAccounts(response.data);
        setIsLoadingAccounts(false);
      }
    } catch (error) {
      console.error("Error fetching shipping accounts:", error);
      setErrorMessage("Failed to load shipping accounts. Please try again.");
      setIsLoadingAccounts(false);
    }
  };

  // Fetch orders on component mount
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setErrorMessage("");

      // In a real app, you would fetch from API
      // For now, we're using mock data with a timeout to simulate loading
      setTimeout(() => {
        setOrders(mockOrders);
        setIsLoadingOrders(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Failed to load orders. Please try again.");
      setIsLoadingOrders(false);
    }
  };

  // Function to validate if user has linked shipping accounts
  const hasLinkedShippingAccounts = () => {
    return shippingAccounts.length > 0;
  };

  // Function to show alert
  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setConfirmAlertOpen(true);
    setTimeout(() => setConfirmAlertOpen(false), 3000);
  };

  const resetShippingAccountForm = () => {
    setNewShippingAccount(emptyShippingAccountForm);
  };

  const handleCreateOrder = async () => {
    if (!hasLinkedShippingAccounts()) {
      showAlert(
        "Please link at least one shipping account before creating orders.",
        "error"
      );
      setCreateDialogOpen(false);
      setShippingAccountsDialogOpen(true);
      return;
    }

    try {
      // In a real application, this would send the order to an API
      // const response = await createShippingOrderApi({
      //   items: newOrder.items,
      //   token: newOrder.token,
      //   shippingAccountId: newOrder.shippingAccountId,
      // });

      // Simulate API call
      const order = {
        id: orders.length + 1,
        date: new Date().toISOString().split("T")[0],
        status: "Pending Confirmation",
        senderPhone: newOrder.senderPhone,
        senderAddress: newOrder.senderAddress,
        receiverPhone: newOrder.receiverPhone,
        receiverAddress: newOrder.receiverAddress,
        receiverName: newOrder.receiverName,
        receiverDistrict: newOrder.receiverDistrict,
        receiverWard: newOrder.receiverWard,
        productName: newOrder.productName,
        productWeight: newOrder.productWeight,
        productQuantity: newOrder.productQuantity,
        productCode: newOrder.productCode,
        packageWeight: newOrder.packageWeight,
        packageLength: newOrder.packageLength,
        packageWidth: newOrder.packageWidth,
        packageHeight: newOrder.packageHeight,
        packageVolumeWeight: newOrder.packageVolumeWeight,
        codAmount: newOrder.codAmount,
        totalValue: newOrder.totalValue,
        cashOnDeliveryFailure: newOrder.cashOnDeliveryFailure,
        failureCharge: newOrder.failureCharge,
        customerOrderCode: newOrder.customerOrderCode,
        deliveryNote: newOrder.deliveryNote,
        notes: newOrder.notes,
        servicePackage: newOrder.servicePackage,
        pickupOption: newOrder.pickupOption,
        pickupLocation: newOrder.pickupLocation,
        packages: newOrder.packages,
        paymentParty: newOrder.paymentParty,
        promotionCode: newOrder.promotionCode,
        timeline: [
          {
            time: new Date().toLocaleString(),
            status: "Order Created",
          },
          {
            time: new Date().toLocaleString(),
            status: "Waiting for Confirmation",
          },
        ],
        locationHistory: [
          {
            time: new Date().toLocaleString(),
            location: newOrder.senderAddress,
            status: "Order Created",
          },
        ],
        collectorName: "John Recycler",
        collectorContact: "555-0123",
      };

      setOrders([order, ...orders]);
      setCreateDialogOpen(false);
      showAlert("Order created successfully!");
      setNewOrder({
        senderPhone: "",
        senderAddress: "",
        receiverPhone: "",
        receiverAddress: "",
        receiverName: "",
        receiverDistrict: "",
        receiverWard: "",
        productName: "Áo Polo",
        productWeight: "1,200",
        productQuantity: "1",
        productCode: "Polo123",
        packageWeight: "200",
        packageLength: "1",
        packageWidth: "19",
        packageHeight: "10",
        packageVolumeWeight: "76",
        codAmount: "200000",
        totalValue: "100000",
        cashOnDeliveryFailure: false,
        failureCharge: "0",
        customerOrderCode: "",
        deliveryNote: "no_view",
        notes: "Tintest 123",
        servicePackage: "light",
        pickupOption: "pickup",
        pickupLocation: "",
        packages: [],
        paymentParty: "receiver",
        promotionCode: "",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      showAlert("Failed to create order. Please try again.", "error");
    }
  };

  const handleAddShippingAccount = async () => {
    try {
      const accountData = {
        ...newShippingAccount,
        user_id: userInfo.id,
        is_default: shippingAccounts.length === 0,
      };

      const response = await createShippingAccountApi(accountData);

      if (response && response.data) {
        const addedAccount = response.data;
        setShippingAccounts((prev) => [...prev, addedAccount]);
        setAddShippingAccountDialogOpen(false);
        showAlert("Shipping account added successfully!");
        resetShippingAccountForm();
      } else {
        await fetchShippingAccounts();
        setAddShippingAccountDialogOpen(false);
        showAlert("Shipping account added successfully!");
        resetShippingAccountForm();
      }
    } catch (error) {
      console.error("Error adding shipping account:", error);
      let errorMessage = "Failed to add shipping account. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!newShippingAccount.name) {
        errorMessage = "Account name is required";
      } else if (!newShippingAccount.carrier) {
        errorMessage = "Carrier is required";
      } else if (!newShippingAccount.shop_id) {
        errorMessage = "Shop ID is required";
      } else if (!newShippingAccount.token) {
        errorMessage = "Token is required";
      }

      showAlert(errorMessage, "error");
    }
  };

  const handleEditShippingAccount = (account) => {
    setSelectedShippingAccount(account);
    setNewShippingAccount({
      name: account.name,
      shop_id: account.shop_id,
      token: account.token,
      carrier: account.carrier,
    });
    setIsEditingShippingAccount(true);
    setShippingAccountsDialogOpen(false);
    setAddShippingAccountDialogOpen(true);
  };

  const handleUpdateShippingAccount = async () => {
    try {
      const response = await updateShippingAccountApi(
        selectedShippingAccount.id,
        newShippingAccount
      );

      const updatedAccount = response.data;

      setShippingAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === updatedAccount.id ? updatedAccount : account
        )
      );

      setAddShippingAccountDialogOpen(false);
      setIsEditingShippingAccount(false);
      showAlert("Shipping account updated successfully!");
      resetShippingAccountForm();
    } catch (error) {
      console.error("Error updating shipping account:", error);
      showAlert(
        "Failed to update shipping account. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteShippingAccount = async (accountId) => {
    try {
      await deleteShippingAccountApi(accountId);
      const updatedAccounts = shippingAccounts.filter(
        (account) => account.id !== accountId
      );

      if (
        shippingAccounts.find((acc) => acc.id === accountId)?.is_default &&
        updatedAccounts.length > 0
      ) {
        updatedAccounts[0].is_default = true;
        await setDefaultShippingAccountApi(updatedAccounts[0].id);
      }

      setShippingAccounts(updatedAccounts);
      showAlert("Shipping account removed successfully!");
    } catch (error) {
      console.error("Error deleting shipping account:", error);
      showAlert(
        "Failed to delete shipping account. Please try again.",
        "error"
      );
    }
  };

  const handleSetDefaultShippingAccount = async (accountId) => {
    try {
      const response = await setDefaultShippingAccountApi(accountId);
      const updatedAccount = response.data;
      setShippingAccounts((prev) =>
        prev.map((account) =>
          account.id === updatedAccount.id
            ? { ...updatedAccount, is_default: true }
            : { ...account, is_default: false }
        )
      );
      showAlert("Default shipping account updated!");
    } catch (error) {
      console.error("Error setting default shipping account:", error);
      showAlert(
        "Failed to update default shipping account. Please try again.",
        "error"
      );
    }
  };

  const calculatePoints = (items) => {
    // Calculate based on the new type IDs
    let total = 0;
    items.forEach((item) => {
      total += (wasteTypesMap[item.type] || 5) * item.quantity;
    });
    return total;
  };

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { type: "", quantity: 1, unit: "kg" }],
    });
  };

  const handleRemoveItem = (index) => {
    const items = [...newOrder.items];
    items.splice(index, 1);
    setNewOrder({ ...newOrder, items });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...newOrder.items];
    items[index][field] = value;
    setNewOrder({ ...newOrder, items });
  };

  const handleOpenEditBuyerInfo = (order) => {
    setSelectedOrder(order);
    setBuyerInfo({
      name: order.buyerName || "",
      phone: order.buyerPhone || "",
      email: order.buyerEmail || "",
      notes: order.notes || "",
    });
    setBuyerInfoDialogOpen(true);
  };

  const handleUpdateBuyerInfo = async () => {
    try {
      // In a real application, this would send the data to an API
      // const response = await updateShippingOrderApi({
      //   orderId: selectedOrder.id,
      //   buyerInfo: buyerInfo
      // });

      // Simulate API call
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            buyerName: buyerInfo.name,
            buyerPhone: buyerInfo.phone,
            buyerEmail: buyerInfo.email,
            notes: buyerInfo.notes,
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setBuyerInfoDialogOpen(false);
      showAlert("Buyer information updated successfully!");
    } catch (error) {
      console.error("Error updating buyer information:", error);
      showAlert(
        "Failed to update buyer information. Please try again.",
        "error"
      );
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    // Set a small timeout to resolve the aria-hidden focus issue
    setTimeout(() => {
      setDetailsDialogOpen(true);
    }, 10);
  };

  const handleTrackOrder = async (order) => {
    try {
      // In a real app, you might want to refresh the order details from the server
      // const response = await getShippingOrderDetailApi(order.id);
      // const updatedOrder = response.data;
      // setSelectedOrder(updatedOrder);

      setSelectedOrder(order);
      // Set a small timeout to resolve the aria-hidden focus issue
      setTimeout(() => {
        setTrackingDialogOpen(true);
      }, 10);
    } catch (error) {
      console.error("Error fetching order tracking details:", error);
      showAlert(
        "Failed to load tracking information. Please try again.",
        "error"
      );
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      // In a real application, this would send the request to an API
      // await cancelShippingOrderApi(orderId);

      // Simulate API call
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          const newTimeline = [
            ...order.timeline,
            {
              time: new Date().toLocaleString(),
              status: "Cancelled by User",
            },
          ];

          const newLocationHistory = [
            ...(order.locationHistory || []),
            {
              time: new Date().toLocaleString(),
              location: order.location,
              status: "Order Cancelled",
            },
          ];

          return {
            ...order,
            status: "Cancelled",
            timeline: newTimeline,
            locationHistory: newLocationHistory,
            points: 0,
          };
        }
        return order;
      });
      setOrders(updatedOrders);
      showAlert("Order has been cancelled.");
    } catch (error) {
      console.error("Error cancelling order:", error);
      showAlert("Failed to cancel order. Please try again.", "error");
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      // In a real application, this would send the request to an API
      // await updateShippingOrderApi({
      //   orderId: orderId,
      //   status: "In Progress"
      // });

      // Simulate API call
      const updatedOrders = orders.map((order) => {
        if (order.id === orderId) {
          const timestamp = new Date().toLocaleString();
          const newTimeline = [
            ...order.timeline,
            {
              time: timestamp,
              status: "Confirmed by User",
            },
          ];

          const newLocationHistory = [
            ...(order.locationHistory || []),
            {
              time: timestamp,
              location: order.location,
              status: "Order Confirmed",
            },
          ];

          return {
            ...order,
            status: "In Progress",
            timeline: newTimeline,
            locationHistory: newLocationHistory,
          };
        }
        return order;
      });
      setOrders(updatedOrders);
      showAlert(
        "Order confirmed successfully. A collector will be assigned soon."
      );
    } catch (error) {
      console.error("Error confirming order:", error);
      showAlert("Failed to confirm order. Please try again.", "error");
    }
  };

  return (
    <Box>
      {confirmAlertOpen && (
        <Alert
          severity={alertSeverity}
          sx={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            backgroundColor:
              alertSeverity === "success" ? "var(--light-green)" : "#FFF3E0",
            color:
              alertSeverity === "success" ? "var(--primary-green)" : "#E65100",
            border: `1px solid ${
              alertSeverity === "success" ? "var(--primary-green)" : "#FB8C00"
            }`,
          }}
          onClose={() => setConfirmAlertOpen(false)}
        >
          {alertMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ color: "var(--primary-green)" }}
        >
          Your Orders
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            className="customer-button-secondary"
            onClick={() => setShippingAccountsDialogOpen(true)}
            sx={{
              borderColor: "var(--primary-green)",
              color: "var(--primary-green)",
            }}
          >
            Shipping Accounts
          </Button>
          <Button
            variant="contained"
            className="customer-button"
            onClick={() => {
              if (!hasLinkedShippingAccounts()) {
                showAlert(
                  "Please link at least one shipping account before creating orders.",
                  "error"
                );
                setShippingAccountsDialogOpen(true);
              } else {
                setCreateDialogOpen(true);
              }
            }}
            startIcon={<AddIcon />}
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            New Order
          </Button>
        </Box>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {isLoadingOrders ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress color="success" />
        </Box>
      ) : orders.length === 0 ? (
        <EmptyOrderState
          hasLinkedShippingAccounts={hasLinkedShippingAccounts()}
          handleOpenCreateDialog={() => setCreateDialogOpen(true)}
          handleOpenShippingAccountsDialog={() =>
            setShippingAccountsDialogOpen(true)
          }
        />
      ) : (
        <OrdersList
          orders={orders}
          handleViewDetails={handleViewDetails}
          handleTrackOrder={handleTrackOrder}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
        />
      )}

      {/* Shipping Accounts Dialog */}
      <Dialog
        open={shippingAccountsDialogOpen}
        onClose={() => setShippingAccountsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {isLoadingAccounts ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress color="success" />
            <Typography sx={{ mt: 2 }}>Loading shipping accounts...</Typography>
          </Box>
        ) : (
          <ShippingAccountsList
            shippingAccounts={shippingAccounts}
            handleSetDefaultShippingAccount={handleSetDefaultShippingAccount}
            handleEditShippingAccount={handleEditShippingAccount}
            handleDeleteShippingAccount={handleDeleteShippingAccount}
            handleOpenAddDialog={() => {
              setShippingAccountsDialogOpen(false);
              setIsEditingShippingAccount(false);
              resetShippingAccountForm();
              setAddShippingAccountDialogOpen(true);
            }}
            handleCloseDialog={() => setShippingAccountsDialogOpen(false)}
          />
        )}
      </Dialog>

      {/* Add/Edit Shipping Account Dialog */}
      <Dialog
        open={addShippingAccountDialogOpen}
        onClose={() => {
          setAddShippingAccountDialogOpen(false);
          if (isEditingShippingAccount) {
            setShippingAccountsDialogOpen(true);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <AddShippingAccountForm
          newShippingAccount={newShippingAccount}
          setNewShippingAccount={setNewShippingAccount}
          handleAddShippingAccount={handleAddShippingAccount}
          handleUpdateShippingAccount={handleUpdateShippingAccount}
          handleCloseDialog={() => setAddShippingAccountDialogOpen(false)}
          handleOpenManageDialog={() => setShippingAccountsDialogOpen(true)}
          isEditing={isEditingShippingAccount}
          resetForm={resetShippingAccountForm}
        />
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <CreateOrderForm
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleCreateOrder={handleCreateOrder}
          handleCloseDialog={() => setCreateDialogOpen(false)}
          calculatePoints={calculatePoints}
          shippingAccounts={shippingAccounts}
          wasteCategories={wasteCategories}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
        />
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          order={selectedOrder}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
        />
      )}

      {/* Order Tracking Dialog */}
      {selectedOrder && (
        <OrderTrackingDialog
          open={trackingDialogOpen}
          onClose={() => setTrackingDialogOpen(false)}
          order={selectedOrder}
          handleViewDetails={handleViewDetails}
        />
      )}

      {/* Edit Buyer Information Dialog */}
      <Dialog
        open={buyerInfoDialogOpen}
        onClose={() => setBuyerInfoDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Update Buyer Information
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Buyer Name"
                fullWidth
                value={buyerInfo.name}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, name: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={buyerInfo.phone}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, phone: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={buyerInfo.email}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, email: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                fullWidth
                multiline
                rows={3}
                value={buyerInfo.notes}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, notes: e.target.value })
                }
                margin="normal"
                placeholder="Special instructions or requests"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setBuyerInfoDialogOpen(false)}
            className="customer-button-secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateBuyerInfo} className="customer-button">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
