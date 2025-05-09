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
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";

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
  getAllShippingOrdersBySeller,
  getShippingAccountsByUserApi,
  createShippingAccountApi,
  updateShippingAccountApi,
  deleteShippingAccountApi,
  setDefaultShippingAccountApi,
  getSellerTransactionHistory,
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

// Add this TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Add this TransactionOrdersList component
function TransactionOrdersList({
  transactions,
  handleCreateOrderFromTransaction,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter transactions by search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.public_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.item_snapshot?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.buyer?.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
        <TextField
          placeholder="Search purchase requests..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2, minWidth: 250 }}
        />
      </Box>

      {filteredTransactions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No pending purchase requests found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Buyer</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.public_id}</TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.buyer
                      ? transaction.buyer.full_name ||
                        transaction.buyer.username
                      : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {transaction.item_snapshot?.name || "Unknown Product"}
                  </TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(transaction.total_price)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.status}
                      color={
                        transaction.status === "pending" ? "warning" : "success"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Create Order">
                      <IconButton
                        onClick={() =>
                          handleCreateOrderFromTransaction(transaction)
                        }
                        color="primary"
                      >
                        <ShoppingCartIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default function CustomerOrders() {
  const userInfo = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
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
  const [tabValue, setTabValue] = useState(0);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isCreatingBasedOn, setIsCreatingBasedOn] = useState(false);
  const initialOrderPayload = {
    payment_type_id: 2,
    note: "",
    required_note: "KHONGCHOXEMHANG",
    return_phone: "",
    return_address: "",
    return_district_id: null,
    return_ward_code: "",
    client_order_code: "",
    from_name: "",
    from_phone: "",
    from_address: "",
    from_ward_name: "",
    from_district_name: "",
    from_province_name: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_name: "",
    to_district_name: "",
    to_province_name: "",
    cod_amount: 0,
    content: "",
    length: 0,
    width: 0,
    height: 0,
    weight: 0,
    cod_failed_amount: 0,
    pick_station_id: null,
    deliver_station_id: null,
    insurance_value: 0,
    service_type_id: 2,
    coupon: null,
    pickup_time: null,
    pick_shift: [],
    items: [
      {
        name: "",
        code: "",
        quantity: 0,
        price: 0,
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
        category: {
          level1: "",
        },
      },
    ],
  };

  const [newOrder, setNewOrder] = useState(initialOrderPayload);
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
    fetchTransactions();
  }, []);

  const fetchShippingAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      setErrorMessage("");

      const response = await getShippingAccountsByUserApi();
      console.log("check newShippingAccount", response);
      if (response.status === 200) {
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

      const response = await getAllShippingOrdersBySeller();
      console.log("Orders from API:", response.data);
      if (response && response.data) {
        // Map the API response to the format our component expects
        const formattedOrders = response.data.map((order) => {
          // Map GHN status codes to UI-friendly status
          let status;
          switch (order.status) {
            case "ready_to_pick":
              status = "Pending Confirmation";
              break;
            case "picking":
            case "storing":
            case "transporting":
              status = "In Progress";
              break;
            case "delivered":
              status = "Completed";
              break;
            case "cancel":
              status = "Cancelled";
              break;
            default:
              status = "Pending Confirmation";
          }

          // Format date from ISO to local date format
          const formattedDate = new Date(
            order.created_date
          ).toLocaleDateString();

          // Create a dummy items array (since GHN doesn't provide item details in the orders list)
          const dummyItems = [
            {
              type: "Package",
              quantity: 1,
              unit: "pkg",
              weight: order.weight ? `${order.weight}g` : "N/A",
            },
          ];

          return {
            id: order.id,
            orderCode: order.order_code,
            date: formattedDate,
            to_name: order.to_name,
            to_phone: order.to_phone,
            to_address: order.to_address,
            status: status,
            items: dummyItems,
            codAmount: order.cod_amount,
            shippingFee: order.total_amount - order.cod_amount,
            totalAmount: order.total_amount,
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            // Add timeline and location history for the order tracking view
            timeline: [
              {
                time: new Date(order.created_date).toLocaleString(),
                status: "Order Created",
              },
              {
                time: new Date(order.updated_at).toLocaleString(),
                status: `Status: ${status}`,
              },
            ],
            locationHistory: [
              {
                time: new Date(order.created_date).toLocaleString(),
                location: "Sender Address",
                status: "Order Created",
              },
            ],
            // Additional fields
            points: 0, // No points in GHN, but UI requires it
            collectorName: "GHN Delivery",
            collectorContact: "1900 636 677",
          };
        });

        setOrders(formattedOrders);
      }
      setIsLoadingOrders(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorMessage("Failed to load orders. Please try again.");
      setIsLoadingOrders(false);
    }
  };

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      setErrorMessage("");

      const response = await getSellerTransactionHistory();
      if (response && response.data) {
        // Filter only pending transactions
        const pendingTransactions = response.data.filter(
          (transaction) => transaction.status === "pending"
        );
        setTransactions(pendingTransactions);
      }
      setIsLoadingTransactions(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setErrorMessage("Failed to load purchase requests. Please try again.");
      setIsLoadingTransactions(false);
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
      const selectedAccount = shippingAccounts[0];
      console.log("check newOrder from creating order", newOrder);
      console.log("check selectedAccount from creating order", selectedAccount);
      const response = await createShippingOrderApi(
        newOrder,
        selectedAccount.token,
        selectedAccount.shop_id
      );

      console.log("check response from creating order", response);

      const order = {
        payment_type_id: 2,
        note: newOrder.note,
        required_note: newOrder.deliveryNote,
        return_phone: newOrder.from_phone,
        return_address: newOrder.from_address,
        return_district_id: null,
        return_ward_code: "",
        client_order_code: newOrder.customerOrderCode || "",
        from_name: "TinTest124",
        from_phone: newOrder.from_phone,
        from_address: newOrder.from_address,
        from_ward_name: newOrder.from_ward_name,
        from_district_name: newOrder.from_district_name,
        from_province_name: "HCM",
        to_name: newOrder.to_name,
        to_phone: newOrder.to_phone,
        to_address: newOrder.to_address,
        to_ward_name: newOrder.to_ward_name,
        to_district_name: newOrder.to_district_name,
        to_province_name: "HCM",
        cod_amount: parseInt(newOrder.codAmount),
        content: "Theo New York Times",
        length: parseInt(newOrder.length),
        width: parseInt(newOrder.width),
        height: parseInt(newOrder.height),
        weight: parseInt(newOrder.weight),
        cod_failed_amount: parseInt(newOrder.failureCharge) || 0,
        pick_station_id: 1444,
        deliver_station_id: null,
        insurance_value: parseInt(newOrder.totalValue),
        service_type_id: 2,
        coupon: null,
        pickup_time: Math.floor(Date.now() / 1000), // Unix timestamp
        pick_shift: [2],
        items: [
          {
            name: newOrder.productName,
            code: newOrder.productCode,
            quantity: parseInt(newOrder.productQuantity),
            price: parseInt(newOrder.cod_amount),
            length: parseInt(newOrder.length),
            width: parseInt(newOrder.width),
            height: parseInt(newOrder.height),
            weight: parseInt(newOrder.weight),
            category: {
              level1: "Áo", // hardcode hoặc để user chọn category
            },
          },
        ],
      };
      setOrders([order, ...orders]);
      setCreateDialogOpen(false);
      showAlert("Order created successfully!");
      setNewOrder(initialOrderPayload);
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
      if (!selectedOrder) {
        throw new Error("No order selected");
      }

      // Find the shipping account (in a real app, this would be associated with the order)
      const shippingAccount =
        shippingAccounts.find((account) => account.is_default) ||
        shippingAccounts[0];

      if (!shippingAccount) {
        throw new Error("No shipping account found to update this order");
      }

      // Prepare GHN update data
      const updateData = {
        order_code: selectedOrder.orderCode,
        to_name: buyerInfo.name || selectedOrder.to_name,
        to_phone: buyerInfo.phone || selectedOrder.to_phone,
        note: buyerInfo.notes || selectedOrder.notes,
      };

      // Call the GHN API to update the order
      await updateShippingOrderApi({
        orderData: updateData,
        token: shippingAccount.token,
        shopId: shippingAccount.shop_id,
      });

      // Update our local state
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            to_name: buyerInfo.name || order.to_name,
            to_phone: buyerInfo.phone || order.to_phone,
            notes: buyerInfo.notes || order.notes,
            timeline: [
              ...order.timeline,
              {
                time: new Date().toLocaleString(),
                status: "Buyer Information Updated",
              },
            ],
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setBuyerInfoDialogOpen(false);
      showAlert("Buyer information updated successfully!");

      // Refresh orders to get updated data
      fetchOrders();
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
      setIsLoadingOrders(true);

      // Fetch the latest tracking information from GHN using the order code
      const response = await getShippingOrderDetailApi(order.orderCode);

      if (response && response.data && response.data.data) {
        const trackingData = response.data.data;

        // Create timeline events from tracking data
        let updatedTimeline = [
          {
            time: new Date(order.date).toLocaleString(),
            status: "Order Created",
          },
        ];

        // Add status logs if available
        if (
          trackingData.status_histories &&
          trackingData.status_histories.length > 0
        ) {
          trackingData.status_histories.forEach((history) => {
            updatedTimeline.push({
              time: new Date(history.timestamp).toLocaleString(),
              status: history.status_name || history.status || "Status Updated",
            });
          });
        }

        // Create location history from tracking data
        let updatedLocationHistory = [
          {
            time: new Date(order.date).toLocaleString(),
            location: order.to_address,
            status: "Order Created",
          },
        ];

        // Add location logs if available
        if (trackingData.log && trackingData.log.length > 0) {
          trackingData.log.forEach((logEntry) => {
            updatedLocationHistory.push({
              time: new Date(logEntry.timestamp).toLocaleString(),
              location: logEntry.location || "Unknown",
              status: logEntry.status || "Location Updated",
            });
          });
        }

        // Update the order with current status and tracking info
        const updatedOrder = {
          ...order,
          status:
            trackingData.status === "cancel"
              ? "Cancelled"
              : trackingData.status === "delivered"
              ? "Completed"
              : trackingData.status === "storing" ||
                trackingData.status === "picking" ||
                trackingData.status === "transporting"
              ? "In Progress"
              : "Pending Confirmation",
          timeline: updatedTimeline,
          locationHistory: updatedLocationHistory,
          expectedDelivery:
            trackingData.expected_delivery_time || order.expectedDelivery,
          // Update any other fields that might have changed
        };

        // Update this order in our local state
        const updatedOrders = orders.map((o) =>
          o.id === order.id ? updatedOrder : o
        );

        setOrders(updatedOrders);
        setSelectedOrder(updatedOrder);
      } else {
        // If no data returned from API, just show what we have
        setSelectedOrder(order);
      }

      setIsLoadingOrders(false);

      // Set a small timeout to resolve the aria-hidden focus issue
      setTimeout(() => {
        setTrackingDialogOpen(true);
      }, 10);
    } catch (error) {
      console.error("Error fetching order tracking details:", error);
      setIsLoadingOrders(false);
      showAlert(
        "Failed to load tracking information. Please try again.",
        "error"
      );
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const orderToCancel = orders.find((order) => order.id === orderId);
      if (!orderToCancel) {
        throw new Error("Order not found");
      }

      // Call the API to cancel the order using the GHN order code
      await cancelShippingOrderApi(orderToCancel.orderCode);

      // Update the local state with the cancelled order
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
              location: order.to_address,
              status: "Order Cancelled",
            },
          ];

          return {
            ...order,
            status: "Cancelled",
            timeline: newTimeline,
            locationHistory: newLocationHistory,
          };
        }
        return order;
      });
      setOrders(updatedOrders);
      showAlert("Order has been cancelled successfully.");

      // Refresh orders from the server to get updated status
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      showAlert("Failed to cancel order. Please try again.", "error");
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const orderToConfirm = orders.find((order) => order.id === orderId);
      if (!orderToConfirm) {
        throw new Error("Order not found");
      }

      // In GHN's API, we don't actually need to confirm an order as it's automatically confirmed
      // This is mainly for the UI state management
      // For demonstration, we'll update the order status in our local state

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
              location: order.to_address,
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
      showAlert("Order confirmed. The delivery carrier has been notified.");

      // In a real implementation, you might want to refresh the orders to get updated status
      // fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
      showAlert("Failed to confirm order. Please try again.", "error");
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter orders by status for each tab
  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending"
  );
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending Confirmation"
  );
  const confirmedOrders = orders.filter(
    (order) => order.status === "In Progress"
  );
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  );
  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  );

  const handleCreateBasedOn = (order) => {
    // Create a new order based on the selected order
    setIsCreatingBasedOn(true);

    // Copy the relevant data from the existing order to the new order form
    const basedOnOrder = {
      from_phone: order.from_phone || "",
      from_address: order.from_address || "",
      to_phone: order.to_phone || "",
      to_address: order.to_address || "",
      to_name: order.to_name || "",
      to_district_name: order.to_district_name || "",
      to_ward_name: order.to_ward_name || "",
      productName: order.productName || "Áo Polo",
      weight: order.weight || null,
      productQuantity: order.productQuantity || "1",
      productCode: order.productCode || "Polo123",
      length: order.length || null,
      width: order.width || null,
      height: order.height || "10",
      packageVolumeWeight: order.packageVolumeWeight || "76",
      codAmount: order.codAmount || "200000",
      totalValue: order.totalValue || "100000",
      cashOnDeliveryFailure: order.cashOnDeliveryFailure || false,
      failureCharge: order.failureCharge || "0",
      customerOrderCode: "", // New order should have a new code
      deliveryNote: order.deliveryNote || "no_view",
      notes: order.notes || "Tintest 123",
      servicePackage: order.servicePackage || "light",
      pickupOption: order.pickupOption || "pickup",
      pickupLocation: order.pickupLocation || "",
      packages: order.packages || [],
      paymentParty: order.paymentParty || "receiver",
      promotionCode: "",
    };

    setNewOrder(basedOnOrder);
    setCreateDialogOpen(true);
  };

  const handleEditOrder = (order) => {
    setIsEditingOrder(true);
    setSelectedOrder(order);

    // Copy all data from the existing order to the form
    const editableOrder = {
      ...order,
      from_phone: order.from_phone || "",
      from_address: order.from_address || "",
      to_phone: order.to_phone || "",
      to_address: order.to_address || "",
      to_name: order.to_name || "",
      to_district_name: order.to_district_name || "",
      to_ward_name: order.to_ward_name || "",
      productName: order.productName || "",
      weight: order.weight || null,
      productQuantity: order.productQuantity || "",
      productCode: order.productCode || "",
      length: order.length || null,
      width: order.width || null,
      height: order.height || null,
      packageVolumeWeight: order.packageVolumeWeight || "76",
      codAmount: order.codAmount || "0",
      totalValue: order.totalValue || "0",
      cashOnDeliveryFailure: order.cashOnDeliveryFailure || false,
      failureCharge: order.failureCharge || "0",
      customerOrderCode: order.orderCode || "",
      deliveryNote: order.deliveryNote || "no_view",
      notes: order.notes || "",
      servicePackage: order.servicePackage || "light",
      pickupOption: order.pickupOption || "pickup",
      pickupLocation: order.pickupLocation || "",
      packages: order.packages || [],
      paymentParty: order.paymentParty || "receiver",
      promotionCode: order.promotionCode || "",
    };

    setNewOrder(editableOrder);
    setCreateDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    try {
      // Find shipping account (in a real app would be stored with the order)
      const shippingAccount =
        shippingAccounts.find((account) => account.is_default) ||
        shippingAccounts[0];

      if (!shippingAccount) {
        throw new Error("No shipping account found to update this order");
      }

      // Prepare update data
      const updateData = {
        order_code: selectedOrder.orderCode,
        to_name: newOrder.to_name || selectedOrder.to_name,
        to_phone: newOrder.to_phone || selectedOrder.to_phone,
        to_address: newOrder.to_address || selectedOrder.to_address,
        // to_ward_code: newOrder.to_ward_name || selectedOrder.to_ward_name,
        to_district_id:
          parseInt(newOrder.to_district_name) ||
          parseInt(selectedOrder.to_district_name),
        content: newOrder.content,
        weight: parseInt(newOrder.weight) || 200,
        length: parseInt(newOrder.length) || 10,
        width: parseInt(newOrder.width) || 10,
        height: parseInt(newOrder.height) || 10,
        cod_amount: parseInt(newOrder.cod_amount) || 0,
        note: newOrder.note,
      };

      // Call the API to update the order
      await updateShippingOrderApi({
        orderData: updateData,
        token: shippingAccount.token,
        shopId: shippingAccount.shop_id,
      });

      showAlert("Order updated successfully!");
      setCreateDialogOpen(false);
      setIsEditingOrder(false);

      // Refresh orders to get updated data
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      showAlert("Failed to update order. Please try again.", "error");
    }
  };

  // Function to handle creating order from transaction
  const handleCreateOrderFromTransaction = (transaction) => {
    // Create a new order based on the transaction data
    setIsCreatingBasedOn(false);

    // Create a prepopulated order form based on transaction data
    const newOrderFromTransaction = {
      ...initialOrderPayload,
      from_phone: userInfo?.phone || "",
      from_address: userInfo?.address || "",
      to_name:
        transaction.buyer?.full_name || transaction.buyer?.username || "",
      to_phone: transaction.buyer?.phone || "",
      to_address: transaction.buyer?.address || "",
      productName: transaction.item_snapshot?.name || "",
      productQuantity: transaction.quantity || 1,
      productCode: transaction.item_snapshot?.public_id || "",
      length: 10, // Default value
      width: 10, // Default value
      height: 10, // Default value
      weight: 200, // Default value
      packageVolumeWeight: "76",
      codAmount: transaction.total_price || 0,
      totalValue: transaction.total_price || 0,
      notes: `Order created from transaction ${transaction.public_id}`,
      // Add other default values as needed
    };

    setNewOrder(newOrderFromTransaction);
    setCreateDialogOpen(true);
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

      {isLoadingOrders && isLoadingTransactions ? (
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
      ) : orders.length === 0 && transactions.length === 0 ? (
        <EmptyOrderState
          hasLinkedShippingAccounts={hasLinkedShippingAccounts()}
          handleOpenCreateDialog={() => setCreateDialogOpen(true)}
          handleOpenShippingAccountsDialog={() =>
            setShippingAccountsDialogOpen(true)
          }
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="order status tabs"
              sx={{
                "& .MuiTab-root": {
                  color: "text.secondary",
                  "&.Mui-selected": { color: "var(--primary-green)" },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--primary-green)",
                },
              }}
            >
              <Tab
                label={`Pending Requests (${pendingTransactions.length})`}
                {...a11yProps(0)}
              />
              <Tab
                label={`Pending Orders (${pendingOrders.length})`}
                {...a11yProps(1)}
              />
              <Tab
                label={`In Progress (${confirmedOrders.length})`}
                {...a11yProps(2)}
              />
              <Tab
                label={`Completed (${completedOrders.length})`}
                {...a11yProps(3)}
              />
              <Tab
                label={`Cancelled (${cancelledOrders.length})`}
                {...a11yProps(4)}
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {isLoadingTransactions ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress color="success" />
              </Box>
            ) : (
              <TransactionOrdersList
                transactions={pendingTransactions}
                handleCreateOrderFromTransaction={
                  handleCreateOrderFromTransaction
                }
              />
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <OrdersList
              orders={pendingOrders}
              handleViewDetails={handleViewDetails}
              handleTrackOrder={handleTrackOrder}
              handleConfirmOrder={handleConfirmOrder}
              handleCancelOrder={handleCancelOrder}
              handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
              handleEditOrder={handleEditOrder}
              handleCreateBasedOn={handleCreateBasedOn}
              withFilters={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <OrdersList
              orders={confirmedOrders}
              handleViewDetails={handleViewDetails}
              handleTrackOrder={handleTrackOrder}
              handleConfirmOrder={handleConfirmOrder}
              handleCancelOrder={handleCancelOrder}
              handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
              handleEditOrder={handleEditOrder}
              handleCreateBasedOn={handleCreateBasedOn}
              withFilters={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <OrdersList
              orders={completedOrders}
              handleViewDetails={handleViewDetails}
              handleTrackOrder={handleTrackOrder}
              handleConfirmOrder={handleConfirmOrder}
              handleCancelOrder={handleCancelOrder}
              handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
              handleCreateBasedOn={handleCreateBasedOn}
              withFilters={true}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <OrdersList
              orders={cancelledOrders}
              handleViewDetails={handleViewDetails}
              handleTrackOrder={handleTrackOrder}
              handleConfirmOrder={handleConfirmOrder}
              handleCancelOrder={handleCancelOrder}
              handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
              withFilters={true}
            />
          </TabPanel>
        </Box>
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
        onClose={() => {
          setCreateDialogOpen(false);
          setIsEditingOrder(false);
          setIsCreatingBasedOn(false);
          setNewOrder(initialOrderPayload);
        }}
        fullWidth
        maxWidth="md"
      >
        <CreateOrderForm
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleCreateOrder={
            isEditingOrder ? handleUpdateOrder : handleCreateOrder
          }
          handleCloseDialog={() => {
            setCreateDialogOpen(false);
            setIsEditingOrder(false);
            setIsCreatingBasedOn(false);
          }}
          calculatePoints={calculatePoints}
          shippingAccounts={shippingAccounts}
          wasteCategories={wasteCategories}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
          isEditMode={isEditingOrder}
          isBasedOnMode={isCreatingBasedOn}
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
