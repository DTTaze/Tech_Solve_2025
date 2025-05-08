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
    senderPhone: order.senderPhone || "",
    senderAddress: order.senderAddress || "",
    receiverPhone: order.receiverPhone || "",
    receiverAddress: order.receiverAddress || "",
    receiverName: order.receiverName || "",
    receiverDistrict: order.receiverDistrict || "",
    receiverWard: order.receiverWard || "",
    productName: order.productName || "Áo Polo",
    productWeight: order.weight || order.productWeight || "1,200",
    productQuantity: order.productQuantity || "1",
    productCode: order.productCode || "Polo123",
    packageWeight: order.packageWeight || order.weight || "200",
    packageLength: order.packageLength || "1",
    packageWidth: order.packageWidth || "19",
    packageHeight: order.packageHeight || "10",
    packageVolumeWeight: order.packageVolumeWeight || "76",
    codAmount: order.codAmount || "0",
    totalValue: order.totalValue || order.shippingFee || "0",
    cashOnDeliveryFailure: order.cashOnDeliveryFailure || false,
    failureCharge: order.failureCharge || "0",
    customerOrderCode: order.orderCode || "",
    deliveryNote: order.deliveryNote || "no_view",
    notes: order.notes || "",
    servicePackage: "light",
    pickupOption: "pickup",
    pickupLocation: "",
    packages: [],
    paymentParty: "receiver",
    promotionCode: "",
    // Add any additional fields needed by the form
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
