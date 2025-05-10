import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CreateOrderForm from "../forms/CreateOrderForm";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  handleConfirmOrder,
  handleCancelOrder,
  handleOpenEditBuyerInfo,
}) => {
  if (!order) return null;

  // Transform the order data structure to match the newOrder structure expected by CreateOrderForm
  const formattedOrder = {
    ...order,
    // Sender information
    from_phone: order.from_phone || "",
    from_address: order.from_address || "",

    // Receiver information
    to_name: order.to_name || "",
    to_phone: order.to_phone || "",
    to_address: order.to_address || "",
    to_district_name: order.to_district_name || "",
    to_ward_name: order.to_ward_name || "",

    // Product information
    productName: order.items?.[0]?.name || "Áo Polo",
    productWeight: order.weight || "1,200",
    productQuantity: order.items?.[0]?.quantity || "1",
    productCode: order.items?.[0]?.code || "Polo123",

    // Package information
    packageWeight: order.weight || "200",
    packageLength: order.length || "1",
    packageWidth: order.width || "19",
    packageHeight: order.height || "10",
    packageVolumeWeight: order.volume_weight || "76",

    // Payment information
    codAmount: order.codAmount || "0",
    totalValue: order.totalAmount || order.shippingFee || "0",
    cashOnDeliveryFailure: order.cashOnDeliveryFailure || false,
    failureCharge: order.failureCharge || "0",

    // Order details
    customerOrderCode: order.orderCode || "",
    deliveryNote: order.required_note || "no_view",
    notes: order.note || "",

    // Service information
    servicePackage: order.service_type_id === 2 ? "light" : "standard",
    pickupOption: "pickup",
    pickupLocation: "",
    packages: [],
    paymentParty: "receiver",
    promotionCode: "",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="details-dialog-title"
      disableRestoreFocus
    >
      <DialogContent dividers sx={{ p: 0 }}>
        <CreateOrderForm
          newOrder={formattedOrder}
          setNewOrder={() => {}} // Read-only mode
          handleCreateOrder={() => {}} // Not used in view mode
          handleCloseDialog={onClose}
          calculatePoints={() => 0}
          shippingAccounts={[]}
          wasteCategories={[]}
          handleAddItem={() => {}}
          handleRemoveItem={() => {}}
          handleItemChange={() => {}}
          isViewMode={true} // Flag to indicate view-only mode
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {order.status === "Pending Confirmation" && (
          <>
            <Button
              onClick={() => {
                handleConfirmOrder(order.id);
                onClose();
              }}
              className="customer-button"
            >
              Confirm Order
            </Button>
            <Button
              onClick={() => {
                handleCancelOrder(order.id);
                onClose();
              }}
              color="error"
              variant="contained"
            >
              Cancel Order
            </Button>
          </>
        )}
        <Button
          onClick={onClose}
          className="customer-button-secondary"
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
