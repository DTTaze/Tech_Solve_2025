import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getStatusColor } from "../../../utils/orderUtils";

const OrdersList = ({
  orders,
  handleViewDetails,
  handleTrackOrder,
  handleConfirmOrder,
  handleCancelOrder,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      {/* Desktop view */}
      {!isMobile && (
        <Paper className="customer-card">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Coins Earned</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    sx={{
                      backgroundColor:
                        order.status === "Pending Confirmation"
                          ? "rgba(46, 125, 50, 0.05)"
                          : "inherit",
                    }}
                  >
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.quantity} {item.unit} {item.type}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.points}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewDetails(order)}
                          sx={{
                            minWidth: 0,
                            p: "4px 8px",
                            borderColor: "var(--primary-green)",
                            color: "var(--primary-green)",
                            "&:hover": {
                              borderColor: "var(--dark-green)",
                              backgroundColor: "rgba(46, 125, 50, 0.08)",
                            },
                          }}
                        >
                          <ReceiptIcon fontSize="small" />
                        </Button>

                        {order.status === "In Progress" && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleTrackOrder(order)}
                            sx={{
                              minWidth: 0,
                              p: "4px 8px",
                              borderColor: "var(--primary-green)",
                              color: "var(--primary-green)",
                              "&:hover": {
                                borderColor: "var(--dark-green)",
                                backgroundColor: "rgba(46, 125, 50, 0.08)",
                              },
                            }}
                          >
                            <LocationOnIcon fontSize="small" />
                          </Button>
                        )}

                        {order.status === "Pending Confirmation" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleConfirmOrder(order.id)}
                              sx={{
                                minWidth: 0,
                                p: "4px 8px",
                                bgcolor: "var(--primary-green)",
                                "&:hover": { bgcolor: "var(--dark-green)" },
                              }}
                            >
                              <CheckCircleIcon fontSize="small" />
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleCancelOrder(order.id)}
                              sx={{
                                minWidth: 0,
                                p: "4px 8px",
                              }}
                            >
                              <CancelIcon fontSize="small" />
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Mobile view */}
      {isMobile && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {orders.map((order) => (
            <Accordion
              key={order.id}
              sx={{
                border:
                  order.status === "Pending Confirmation"
                    ? "1px solid var(--primary-green)"
                    : "1px solid var(--grey-300)",
                borderRadius: "8px !important",
                "&:before": {
                  display: "none",
                },
                mb: 1,
                backgroundColor:
                  order.status === "Pending Confirmation"
                    ? "rgba(46, 125, 50, 0.05)"
                    : "var(--white)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`order-${order.id}-content`}
                id={`order-${order.id}-header`}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Order #{order.id}
                    </Typography>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {order.date}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Items:
                    </Typography>
                    {order.items.map((item, idx) => (
                      <Typography key={idx} variant="body2">
                        • {item.quantity} {item.unit} {item.type}
                      </Typography>
                    ))}
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Coins Earned: {order.points}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(order)}
                      sx={{
                        borderColor: "var(--primary-green)",
                        color: "var(--primary-green)",
                        "&:hover": {
                          borderColor: "var(--dark-green)",
                          backgroundColor: "rgba(46, 125, 50, 0.08)",
                        },
                      }}
                    >
                      Details
                    </Button>

                    {order.status === "In Progress" && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleTrackOrder(order)}
                        sx={{
                          borderColor: "var(--primary-green)",
                          color: "var(--primary-green)",
                          "&:hover": {
                            borderColor: "var(--dark-green)",
                            backgroundColor: "rgba(46, 125, 50, 0.08)",
                          },
                        }}
                      >
                        Track
                      </Button>
                    )}

                    {order.status === "Pending Confirmation" && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleConfirmOrder(order.id)}
                          sx={{
                            bgcolor: "var(--primary-green)",
                            "&:hover": { bgcolor: "var(--dark-green)" },
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </>
  );
};

export default OrdersList;
