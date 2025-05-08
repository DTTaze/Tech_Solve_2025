import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  DialogContent,
  DialogActions,
  DialogTitle,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  FormLabel,
  Stack,
  Paper,
  InputAdornment,
  Checkbox,
  Dialog,
  OutlinedInput,
  InputBase,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Product List Dialog Component
const ProductListDialog = ({ open, onClose, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    weight: 0,
    quantity: 1,
    code: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [savedProducts, setSavedProducts] = useState([
    {
      id: 1,
      name: "Phan Tuấn Quốc Anh",
      weight: 200,
      quantity: 1,
      code: "",
    },
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleAddNewProduct = () => {
    // Add to saved products
    const productToAdd = { ...newProduct, id: Date.now() };
    setSavedProducts([...savedProducts, productToAdd]);

    // Clear form
    setNewProduct({ name: "", weight: 0, quantity: 1, code: "" });
    setShowAddForm(false);
  };

  const handleSelectProduct = (product) => {
    onAddProduct(product);
    onClose();
  };

  const handleToggleSelect = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleAddSelectedToOrder = () => {
    const productsToAdd = savedProducts.filter((p) =>
      selectedProducts.includes(p.id)
    );
    if (productsToAdd.length > 0) {
      onAddProduct(productsToAdd[0]); // For now just add the first one
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Danh sách sản phẩm sẵn
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ position: "relative", mb: 3 }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 12,
                top: 12,
                color: "text.secondary",
              }}
            />
            <InputBase
              placeholder="Nhập tên để tìm kiếm"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                py: 1,
                pl: 5,
                pr: 2,
              }}
            />
          </Box>
        </Box>

        {!showAddForm && (
          <>
            {savedProducts.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 10,
                }}
              >
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    bgcolor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NS41MDcgMzEuMDk1SDI0LjI2MVYzMy4zMzNINTUuNTA3VjMxLjA5NVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01NS41MDcgNDIuMzgxSDI0LjI2MVY0NC42MTlINTUuNTA3VjQyLjM4MVoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0zOS44ODEgNTMuNjY3SDI0LjI2MVY1NS45MDVIMzkuODgxVjUzLjY2N1oiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02NS45OTggMjcuOTk4VjU5LjMzM0gxMy45OThWMjAuNjY3SDU4LjY2N0w2NS45OTggMjcuOTk4Wk02MS42NjUgMjkuMzM0SDU3LjMzMVYyNS4wMDFMNjEuNjY1IDI5LjMzNFpNNjMuOTM0IDMxLjYwMUw1NS4wNjQgMjIuNzMyQzU0Ljk2ODQgMjIuNjM0MyA1NC44MzUgMjIuNjY2OCA1NC43OTQ3IDIyLjY4MTNDNTQuNzgyMiAyMi42ODYgNTQuNzcyOCAyMi42ODk1IDU0Ljc2NjcgMjIuNjkwN0M1NC43NjE0IDIyLjY5MTcgNTQuNzUzNyAyMi42OTMzIDU0Ljc0NTMgMjIuNjk0N0M1NC43MzkgMjIuNjk1NyA1NC43MzI0IDIyLjY5NjcgNTQuNzI1NSAyMi42OTc1QzU0LjcyMTYgMjIuNjk4IDU0LjcxNzcgMjIuNjk4NCA1NC43MTM3IDIyLjY5ODhDNTQuNzA1NiAyMi42OTk1IDU0LjY5NzIgMjIuNyA1NC42ODggMjIuN0gxMy45OThDMTIuNzEzIDIyLjcgMTEuNjY1IDIzLjc0OCAxMS42NjUgMjVWNkguMzMzQzExLjY2NSA2MC42MjUgMTUuMzkgNjEuNjY3IDE2LjY2NSA2MS42NjdINjMuMzMyQzY0LjYwNyA2MS42NjcgNjguMzMyIDYwLjYyNSA2OC4zMzIgNTUuMDAxVjI5LjMzNEM2OC4zMzIgMjkuMzI1IDY4LjMzMjcgMjkuMzE3IDY4LjMzMzMgMjkuMzA4OEM2OC4zMzM3IDI5LjMwMzIgNjguMzM0MiAyOS4yOTc0IDY4LjMzNDUgMjkuMjkxNEM2OC4zMzUzIDI5LjI3NjcgNjguMzM1NyAyOS4yNjEgNjguMzMyIDI5LjI0NTdDNjguMzMxMyAyOS4yNDIgNjguMzMwMyAyOS4yMzc1IDY4LjMyOTIgMjkuMjMyN0M2OC4zMjgyIDI5LjIyOCA2OC4zMjcgMjkuMjIzIDY4LjMyNTcgMjkuMjE4QzY4LjMyMTcgMjkuMjA1IDY4LjMxNyAyOS4xOTIzIDY4LjMxMDcgMjkuMTgxN0M2OC4zMDQ3IDI5LjE3MTcgNjguMjk3MiAyOS4xNjI4IDY4LjI4OSAyOS4xNTU3QzY4LjI3OTcgMjkuMTQ3NSA2OC4yNjk1IDI5LjE0MDggNjguMjU5IDI5LjEzNUM2OC4yNTQyIDI5LjEzMjUgNjguMjQ5NSAyOS4xMzAyIDY4LjI0NSAyOS4xMjhDNjguMjMzMiAyOS4xMjI1IDY4LjIyMTIgMjkuMTE4MiA2OC4yMDkgMjkuMTE1QzY4LjIwMTUgMjkuMTEzMiA2OC4xOTQgMjkuMTExNSA2OC4xODY1IDI5LjExMDJDNjguMTgxNyAyOS4xMDk1IDY4LjE3NyAyOS4xMDg4IDY4LjE3MjIgMjkuMTA4QzY4LjE2MSAyOS4xMDY1IDY4LjE0OTUgMjkuMTA2IDY4LjEzOCAyOS4xMDZINjMuOTk4QzYzLjk2MiAyOS4xMDYgNjMuOTI2IDI5LjExMSA2My44OSAyOS4xMkg2My44ODc1QzYzLjg4MzcgMjkuMTIyNSA2My44NzkgMjkuMTI1NyA2My44NzQyIDI5LjEyOU02My44NzQyIDI5LjEyOUM2My44NjggMjkuMTMzMyA2My44NjI1IDI5LjEzOCA2My44NTcyIDI5LjE0MkM2My44NTE3IDI5LjE0NiA2My44NDYgMjkuMTUwNSA2My44NDA1IDI5LjE1NUM2My44MzcyIDI5LjE1OCA2My44MzM3IDI5LjE2MDcgNjMuODMwNSAyOS4xNjM1QzYzLjgyNDcgMjkuMTY4NSA2My44MTg3IDI5LjE3MzIgNjMuODEzMiAyOS4xNzkzQzYzLjgwNTcgMjkuMTg3MiA2My43OTg1IDI5LjE5NTggNjMuNzkyIDI5LjIwNUM2My43ODkyIDI5LjIwODcgNjMuNzg2NSAyOS4yMTI3IDYzLjc4NCAyOS4yMTY3QzYzLjc3NzUgMjkuMjI2IDYzLjc3MTUgMjkuMjM2IDYzLjc2NjIgMjkuMjQ2MkM2My43NTUgMjkuMjY3MiA2My43NDYyIDI5LjI4OTggNjMuNzQwNSAyOS4zMTNDNjMuNzM5IDI5LjMxODMgNjMuNzM3NyAyOS4zMjM1IDYzLjczNjUgMjkuMzI4N0M2My43MzQ4IDI5LjMzNTggNjMuNzMzMiAyOS4zNDMgNjMuNzMyIDI5LjM1QzYzLjczMTggMjkuMzU0NyA2My43MzE2IDI5LjM1OTcgNjMuNzMxNSAyOS4zNjQ3QzYzLjczMTEgMjkuMzc1IDYzLjczMTIgMjkuMzg1NSA2My43MzE3IDI5LjM5NkM2My43MzE4IDI5LjM5OSA2My43MzIgMjkuNDAyIDYzLjczMjIgMjkuNDA1QzYzLjczNCAyOS40MzE1IDYzLjczODIgMjkuNDU3NSA2My43NDQ1IDI5LjQ4MkM2My43NDczIDI5LjQ5MzUgNjMuNzUwNSAyOS41MDQzIDYzLjc1NDIgMjkuNTE0OEM2My43NiAyOS41MzEyIDYzLjc2NzUgMjkuNTQ2NSA2My43NzYgMjkuNTYwN0M2My43NzkyIDI5LjU2NjUgNjMuNzgyNyAyOS41NzIzIDYzLjc4NjUgMjkuNTc3OEM2My43OTc1IDI5LjU5MzggNjMuODA5NyAyOS42MDg1IDYzLjgyMzIgMjkuNjIxN0M2My44MjY1IDI5LjYyNTUgNjMuODMgMjkuNjI5IDYzLjgzMzUgMjkuNjMyNUM2My44NDU3IDI5LjY0NDUgNjMuODU5IDI5LjY1NTggNjMuODczNSAyOS42NjU1QzYzLjg3ODUgMjkuNjY5IDYzLjg4MzUgMjkuNjcyMyA2My44ODg3IDI5LjY3NTVDNjMuODk5NyAyOS42ODIgNjMuOTExMiAyOS42ODggNjMuOTIzMiAyOS42OTI1QzYzLjkyODUgMjkuNjk0NSA2My45MzM3IDI5LjY5NjMgNjMuOTM5IDI5LjY5OEM2My45NTY1IDI5LjcwNCA2My45NzQ1IDI5LjcwODIgNjMuOTkzMiAyOS43MUgyOS43MDVDNjQuMDAxNSAyOS43MSA2NC4wMSAyOS43MDkzIDY0LjAxODUgMjkuNzA4QzY0LjAyODIgMjkuNzA2NSA2NC4wMzggMjkuNzA0MiA2NC4wNDc1IDI5LjcwMUM2NC4wNTI1IDI5LjY5OTMgNjQuMDU3MiAyOS42OTc1IDY0LjA2MiAyOS42OTU1QzY0LjA3NDIgMjkuNjkwNSA2NC4wODYgMjkuNjg0NSA2NC4wOTc1IDI5LjY3NzVDNjQuMTAyNSAyOS42NzQzIDY0LjEwNzUgMjkuNjcxIDY0LjExMjUgMjkuNjY3NVM2NC4xMjY1IDI5LjY1NTggNjQuMTM4NSAyOS42NDM1QzY0LjE0MjIgMjkuNjQgNjQuMTQ1NyAyOS42MzYzIDY0LjE0OSAyOS42MzI1QzY0LjE2MjcgMjkuNjE5IDY0LjE3NTIgMjkuNjA0MiA2NC4xODYgMjkuNTg4QzY0LjE4OTcgMjkuNTgyNyA2NC4xOTMgMjkuNTc3MiA2NC4xOTY1IDI5LjU3MTVDNjQuMjA1MiAyOS41NTcgNjQuMjEzIDI5LjU0MTUgNjQuMjE5IDI5LjUyNUM2NC4yMjI3IDI5LjUxNDUgNjQuMjI2IDI5LjUwMzcgNjQuMjI4NyAyOS40OTI1QzY0LjIzNSAyOS40NjggNjQuMjM5MiAyOS40NDIgNjQuMjQxIDI5LjQxNUM2NC4yNDEzIDI5LjQxMTIgNjQuMjQxNSAyOS40MDc1IDY0LjI0MTcgMjkuNDAzN0M2NC4yNDIyIDI5LjM5MyA2NC4yNDIzIDI5LjM4MjIgNjQuMjQxNyAyOS4zNzE3QzY0LjI0MTUgMjkuMzY3IDY0LjI0MTMgMjkuMzYyMiA2NC4yNDEgMjkuMzU3N0M2NC4yMzk3IDI5LjM0OTIgNjQuMjM4MiAyOS4zNDA4IDY0LjIzNjIgMjkuMzMyNUM2NC4yMzUgMjkuMzI3NSA2NC4yMzM3IDI5LjMyMjUgNjQuMjMyMiAyOS4zMTc1QzY0LjIyNjUgMjkuMjk0MiA2NC4yMTc3IDI5LjI3MTggNjQuMjA2NSAyOS4yNTFDNjQuMjAxMiAyOS4yNDA3IDY0LjE5NTIgMjkuMjMxIDY0LjE4ODcgMjkuMjIxN0M2NC4xODYyIDI5LjIxNzcgNjQuMTgzNyAyOS4yMTM3IDY0LjE4MSAyOS4yMDk3QzY0LjE3NDUgMjkuMjAwMiA2NC4xNjcyIDI5LjE5MTIgNjQuMTU5NSAyOS4xODNDNjQuMTU0MiAyOS4xNzc1IDY0LjE0ODcgMjkuMTcyNyA2NC4xNDMgMjkuMTY4QzY0LjE0IDI5LjE2NTIgNjQuMTM2NyAyOS4xNjI1IDY0LjEzMzIgMjkuMTU5N0M2NC4xMjc3IDI5LjE1NTIgNjQuMTIyMiAyOS4xNTA3IDY0LjExNjUgMjkuMTQ2N0M2NC4xMTEyIDI5LjE0MjcgNjQuMTA1NyAyOS4xMzg1IDY0LjEgMjkuMTM0NUw2NC4wODkgMjkuMTI3NUw2My45MzQgMzEuNjAxWiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K"
                    alt="Empty state"
                    width="80"
                    height="80"
                  />
                </Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Bạn chưa có kiện nào được tạo sẵn
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    mx: 2,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      startIcon={<AddIcon />}
                      size="small"
                      onClick={() => setShowAddForm(true)}
                      sx={{ mr: 2 }}
                    >
                      Thêm 1 sản phẩm
                    </Button>
                    <Box
                      sx={{
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        pr: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ px: 2, py: 0.5 }}>
                        1
                      </Typography>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <ArrowDropDownIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ px: 2 }}>
                  {savedProducts
                    .filter((product) =>
                      product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((product) => (
                      <Paper
                        key={product.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          mb: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleToggleSelect(product.id)}
                          sx={{
                            color: "#f97316",
                            "&.Mui-checked": {
                              color: "#f97316",
                            },
                          }}
                        />
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          {product.name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            KL (gram):{" "}
                            <span
                              style={{ color: "#f97316", fontWeight: "bold" }}
                            >
                              {product.weight}
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Số lượng:{" "}
                            <span
                              style={{ color: "#f97316", fontWeight: "bold" }}
                            >
                              {product.quantity}
                            </span>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Mã sản phẩm: {product.code}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                          <IconButton size="small" sx={{ color: "#1976d2" }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSavedProducts(
                                savedProducts.filter((p) => p.id !== product.id)
                              );
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                </Box>
              </>
            )}

            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #e0e0e0",
                mt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  size="small"
                  checked={false}
                  sx={{
                    color: "#f97316",
                    "&.Mui-checked": {
                      color: "#f97316",
                    },
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  Tự động mở danh sách SP khi thêm SP ở đơn hàng
                </Typography>
              </Box>

              <Button
                variant="contained"
                onClick={handleAddSelectedToOrder}
                sx={{
                  bgcolor: "#f97316",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ea580c",
                  },
                }}
              >
                Thêm sản phẩm vào đơn
              </Button>
            </Box>
          </>
        )}

        {showAddForm && (
          <Box sx={{ p: 2, pt: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Nhập tên"
                    fullWidth
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="KL (gram)"
                    fullWidth
                    type="number"
                    required
                    value={newProduct.weight}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, weight: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">g</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Số lượng"
                    fullWidth
                    type="number"
                    required
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        quantity: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Mã sản phẩm"
                    fullWidth
                    value={newProduct.code}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, code: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setShowAddForm(false)}
                sx={{
                  color: "#f97316",
                  borderColor: "#f97316",
                  "&:hover": {
                    borderColor: "#ea580c",
                  },
                }}
              >
                Xóa
              </Button>
              <Button
                variant="contained"
                onClick={handleAddNewProduct}
                disabled={!newProduct.name || !newProduct.weight}
                sx={{
                  bgcolor: "#f97316",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#ea580c",
                  },
                }}
              >
                Lưu
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CreateOrderForm = ({
  newOrder,
  setNewOrder,
  handleCreateOrder,
  handleCloseDialog,
  calculatePoints,
  shippingAccounts,
  wasteCategories,
  handleAddItem,
  handleRemoveItem,
  handleItemChange,
}) => {
  const [servicePackage, setServicePackage] = useState(
    newOrder.servicePackage || "light"
  );
  const [pickupOption, setPickupOption] = useState(
    newOrder.pickupOption || "pickup"
  );
  const [productListDialogOpen, setProductListDialogOpen] = useState(false);

  const handleServicePackageChange = (event) => {
    setServicePackage(event.target.value);
    setNewOrder({ ...newOrder, servicePackage: event.target.value });
  };

  const handlePickupOptionChange = (event) => {
    setPickupOption(event.target.value);
    setNewOrder({ ...newOrder, pickupOption: event.target.value });
  };

  const handleAddProduct = (product) => {
    setNewOrder({
      ...newOrder,
      productName: product.name,
      productWeight: product.weight,
      productQuantity: product.quantity,
      productCode: product.code,
    });
  };

  return (
    <>
      <DialogTitle
        sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
      >
        Tạo đơn mới
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Bên gửi */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Bên gửi
              </Typography>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  required
                  value={newOrder.senderPhone || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, senderPhone: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">📱</InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <TextField
                  label="Địa chỉ"
                  fullWidth
                  required
                  value={newOrder.senderAddress || ""}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, senderAddress: e.target.value })
                  }
                />
              </FormControl>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <RadioGroup
                  row
                  value={pickupOption}
                  onChange={handlePickupOptionChange}
                >
                  <FormControlLabel
                    value="pickup"
                    control={<Radio color="success" />}
                    label="Lấy hàng tận nơi"
                  />
                  <FormControlLabel
                    value="delivery"
                    control={<Radio color="success" />}
                    label="Gửi hàng tại bưu cục"
                  />
                </RadioGroup>
              </FormControl>

              {pickupOption === "pickup" && (
                <FormControl fullWidth margin="normal">
                  <Select
                    value={newOrder.pickupLocation || ""}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        pickupLocation: e.target.value,
                      })
                    }
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Chọn ca lấy hàng
                    </MenuItem>
                    <MenuItem value="1">1</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Paper>
          </Grid>

          {/* Bên nhận */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Bên nhận
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    required
                    value={newOrder.receiverPhone || ""}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        receiverPhone: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    required
                    value={newOrder.receiverAddress || ""}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        receiverAddress: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Họ tên"
                    fullWidth
                    required
                    value={newOrder.receiverName || ""}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, receiverName: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Quận - Huyện</InputLabel>
                    <Select
                      label="Quận - Huyện"
                      value={newOrder.receiverDistrict || ""}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          receiverDistrict: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="quan3">Quận 3 - Hồ Chí Minh</MenuItem>
                      <MenuItem value="quan1">Quận 1 - Hồ Chí Minh</MenuItem>
                      <MenuItem value="quan2">Quận 2 - Hồ Chí Minh</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Phường - Xã</InputLabel>
                    <Select
                      label="Phường - Xã"
                      value={newOrder.receiverWard || ""}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          receiverWard: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="phuong8">Phường 8</MenuItem>
                      <MenuItem value="phuong9">Phường 9</MenuItem>
                      <MenuItem value="phuong10">Phường 10</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Thông tin sản phẩm (for light package) or Thông tin kiện hàng (for heavy package) */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              {servicePackage === "light" ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Thông tin sản phẩm
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setProductListDialogOpen(true)}
                      sx={{
                        borderColor: "var(--primary-green)",
                        color: "var(--primary-green)",
                      }}
                    >
                      SP có sẵn
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Sản phẩm"
                        fullWidth
                        required
                        value={newOrder.productName || "Áo Polo"}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            productName: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="KL (gram)"
                        fullWidth
                        type="number"
                        required
                        value={newOrder.productWeight || "1,200"}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            productWeight: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Số lượng"
                        fullWidth
                        type="number"
                        required
                        value={newOrder.productQuantity || "1"}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            productQuantity: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Mã sản phẩm"
                        fullWidth
                        value={newOrder.productCode || "Polo123"}
                        onChange={(e) =>
                          setNewOrder({
                            ...newOrder,
                            productCode: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </Grid>

                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                    sx={{
                      mt: 2,
                      color: "var(--primary-green)",
                      "&:hover": {
                        backgroundColor: "rgba(46, 125, 50, 0.08)",
                      },
                    }}
                  >
                    Thêm 1 sản phẩm
                  </Button>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Thông tin kiện hàng
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{
                        borderColor: "var(--primary-green)",
                        color: "var(--primary-green)",
                      }}
                    >
                      Kiện có sẵn
                    </Button>
                  </Box>

                  {newOrder.packages && newOrder.packages.length > 0 ? (
                    newOrder.packages.map((pkg, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          p: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2">
                            Kiện {index + 1}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton size="small">
                              <CancelIcon fontSize="small" color="error" />
                            </IconButton>
                          </Box>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Kiện"
                              fullWidth
                              value={pkg.name || ""}
                              onChange={(e) => {
                                const updatedPackages = [...newOrder.packages];
                                updatedPackages[index].name = e.target.value;
                                setNewOrder({
                                  ...newOrder,
                                  packages: updatedPackages,
                                });
                              }}
                              placeholder="Nhập tên kiện"
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Dài (cm)"
                              fullWidth
                              type="number"
                              required
                              value={pkg.length || ""}
                              onChange={(e) => {
                                const updatedPackages = [...newOrder.packages];
                                updatedPackages[index].length = e.target.value;
                                setNewOrder({
                                  ...newOrder,
                                  packages: updatedPackages,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Rộng (cm)"
                              fullWidth
                              type="number"
                              required
                              value={pkg.width || ""}
                              onChange={(e) => {
                                const updatedPackages = [...newOrder.packages];
                                updatedPackages[index].width = e.target.value;
                                setNewOrder({
                                  ...newOrder,
                                  packages: updatedPackages,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              label="Cao (cm)"
                              fullWidth
                              type="number"
                              required
                              value={pkg.height || ""}
                              onChange={(e) => {
                                const updatedPackages = [...newOrder.packages];
                                updatedPackages[index].height = e.target.value;
                                setNewOrder({
                                  ...newOrder,
                                  packages: updatedPackages,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="KL (gram)"
                              fullWidth
                              type="number"
                              required
                              value={pkg.weight || ""}
                              onChange={(e) => {
                                const updatedPackages = [...newOrder.packages];
                                updatedPackages[index].weight = e.target.value;
                                setNewOrder({
                                  ...newOrder,
                                  packages: updatedPackages,
                                });
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="KL quy đổi"
                              fullWidth
                              disabled
                              value={`${pkg.convertedWeight || "0"} g`}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 5,
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="body1" gutterBottom>
                        Bạn chưa có kiện nào được tạo
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          const newPackage = {
                            name: `Kiện ${
                              (newOrder.packages?.length || 0) + 1
                            }`,
                            length: 10,
                            width: 10,
                            height: 10,
                            weight: 200,
                            convertedWeight: 200,
                          };
                          setNewOrder({
                            ...newOrder,
                            packages: [
                              ...(newOrder.packages || []),
                              newPackage,
                            ],
                          });
                        }}
                        sx={{
                          mt: 2,
                          bgcolor: "#f97316",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#ea580c",
                          },
                        }}
                      >
                        Thêm 1 kiện
                      </Button>
                    </Box>
                  )}

                  {newOrder.packages && newOrder.packages.length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Tổng KL tính cước ({newOrder.packages.length} kiện):{" "}
                        {newOrder.packages.reduce(
                          (sum, pkg) => sum + parseInt(pkg.weight || 0),
                          0
                        )}{" "}
                        g
                      </Typography>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => {
                          const newPackage = {
                            name: `Kiện ${newOrder.packages.length + 1}`,
                            length: 10,
                            width: 10,
                            height: 10,
                            weight: 200,
                            convertedWeight: 200,
                          };
                          setNewOrder({
                            ...newOrder,
                            packages: [...newOrder.packages, newPackage],
                          });
                        }}
                        sx={{
                          ml: 2,
                          color: "var(--primary-green)",
                          "&:hover": {
                            backgroundColor: "rgba(46, 125, 50, 0.08)",
                          },
                        }}
                      >
                        Thêm 1 kiện
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </Grid>

          {/* Thông tin đơn hàng */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Thông tin đơn hàng
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="KL (gram)"
                    fullWidth
                    required
                    type="number"
                    value={newOrder.packageWeight || "200"}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        packageWeight: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Dài (cm)"
                    fullWidth
                    required
                    type="number"
                    value={newOrder.packageLength || "1"}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        packageLength: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Rộng (cm)"
                    fullWidth
                    required
                    type="number"
                    value={newOrder.packageWidth || "19"}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, packageWidth: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Cao (cm)"
                    fullWidth
                    required
                    type="number"
                    value={newOrder.packageHeight || "10"}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        packageHeight: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="KL quy đổi (gram)"
                    fullWidth
                    disabled
                    value={newOrder.packageVolumeWeight || "76"}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Tổng tiền thu hộ (COD)"
                    fullWidth
                    type="number"
                    value={newOrder.codAmount || "200000"}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, codAmount: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">đ</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Tổng giá trị hàng hóa"
                    fullWidth
                    type="number"
                    value={newOrder.totalValue || "100000"}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, totalValue: e.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">đ</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={newOrder.cashOnDeliveryFailure || false}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      cashOnDeliveryFailure: e.target.checked,
                    })
                  }
                  color="success"
                />
                <Typography>Giao thất bại thu tiền</Typography>
                <TextField
                  type="number"
                  size="small"
                  sx={{ ml: 2, width: "100px" }}
                  value={newOrder.failureCharge || "0"}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, failureCharge: e.target.value })
                  }
                  disabled={!newOrder.cashOnDeliveryFailure}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Mã đơn riêng khách hàng"
                  fullWidth
                  placeholder="Nhập mã đơn riêng khách hàng (nếu có)"
                  value={newOrder.customerOrderCode || ""}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      customerOrderCode: e.target.value,
                    })
                  }
                />
              </Box>
            </Paper>
          </Grid>

          {/* Gói dịch vụ */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
              }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Gói dịch vụ
              </Typography>

              <RadioGroup
                value={servicePackage}
                onChange={handleServicePackageChange}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                  }}
                >
                  {/* Light package option */}
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 2,
                      border: `2px solid ${
                        servicePackage === "light" ? "#f97316" : "#e0e0e0"
                      }`,
                      borderRadius: "4px",
                      position: "relative",
                      bgcolor:
                        servicePackage === "light"
                          ? "rgba(249, 115, 22, 0.05)"
                          : "transparent",
                    }}
                  >
                    <FormControlLabel
                      value="light"
                      control={
                        <Radio
                          sx={{
                            color: "#f97316",
                            "&.Mui-checked": {
                              color: "#f97316",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="span"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            📦 Hàng nhẹ ( &lt; 20kg )
                          </Box>
                          <InfoIcon
                            sx={{
                              ml: 1,
                              fontSize: "1rem",
                              color: "text.secondary",
                            }}
                          />
                        </Box>
                      }
                    />
                    <Box sx={{ ml: 4, mt: 1 }}>
                      <Typography variant="body2">
                        Ngày giao dự kiến: 07/05/2025
                      </Typography>
                      <Typography variant="body2">
                        Cước phí: 22.000 đ
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Heavy package option */}
                  <Paper
                    elevation={0}
                    sx={{
                      flex: 1,
                      p: 2,
                      border: `2px solid ${
                        servicePackage === "heavy" ? "#f97316" : "#e0e0e0"
                      }`,
                      borderRadius: "4px",
                      position: "relative",
                      bgcolor:
                        servicePackage === "heavy"
                          ? "rgba(249, 115, 22, 0.05)"
                          : "transparent",
                    }}
                  >
                    <FormControlLabel
                      value="heavy"
                      control={
                        <Radio
                          sx={{
                            color: "#f97316",
                            "&.Mui-checked": {
                              color: "#f97316",
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            component="span"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            🚚 Hàng nặng ( &gt;= 20kg )
                          </Box>
                          <InfoIcon
                            sx={{
                              ml: 1,
                              fontSize: "1rem",
                              color: "text.secondary",
                            }}
                          />
                        </Box>
                      }
                    />
                    <Box sx={{ ml: 4, mt: 1 }}>
                      <Typography variant="body2">
                        Ngày giao dự kiến: 07/05/2025
                      </Typography>
                      <Typography variant="body2">
                        Cước phí: 2.090.000 đ{" "}
                        <Typography
                          component="span"
                          sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                        >
                          (giá ước tính)
                        </Typography>
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </RadioGroup>
            </Paper>
          </Grid>

          {/* Lưu ý - Ghi chú */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "4px" }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Lưu ý - Ghi chú
              </Typography>

              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ mt: 2, mb: 1, color: "#f97316" }}
              >
                Lưu ý giao hàng *
              </Typography>

              <RadioGroup
                value={newOrder.deliveryNote || "no_view"}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, deliveryNote: e.target.value })
                }
              >
                <FormControlLabel
                  value="no_view"
                  control={
                    <Radio
                      sx={{
                        color: "#2e7d32",
                        "&.Mui-checked": { color: "#2e7d32" },
                      }}
                    />
                  }
                  label="Không cho xem hàng"
                />
                <FormControlLabel
                  value="view_no_try"
                  control={
                    <Radio
                      sx={{
                        color: "#2e7d32",
                        "&.Mui-checked": { color: "#2e7d32" },
                      }}
                    />
                  }
                  label="Cho xem hàng không cho thử"
                />
                <FormControlLabel
                  value="try"
                  control={
                    <Radio
                      sx={{
                        color: "#2e7d32",
                        "&.Mui-checked": { color: "#2e7d32" },
                      }}
                    />
                  }
                  label="Cho thử hàng"
                />
              </RadioGroup>

              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 2 }}
                value={newOrder.notes || "Tintest 123"}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, notes: e.target.value })
                }
                placeholder="Thêm ghi chú cho đơn hàng"
              />
            </Paper>
          </Grid>

          {/* Chi phí chi tiết */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: "4px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Chi phí chi tiết
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderBottom: "1px dashed #e0e0e0",
                  pb: 2,
                  mb: 2,
                }}
              >
                {servicePackage === "light" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phí dịch vụ
                      </Typography>
                      <Typography variant="body2">22.000 đ</Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phí dịch vụ
                      </Typography>
                      <Typography variant="body2">2.090.000 đ</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phí thu COD
                      </Typography>
                      <Typography variant="body2">55.000 đ</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phí thu giao thất bại thu tiền
                      </Typography>
                      <Typography variant="body2">33.000 đ</Typography>
                    </Box>
                  </>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <FormControl>
                  <Select
                    value={newOrder.paymentParty || "receiver"}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, paymentParty: e.target.value })
                    }
                    displayEmpty
                    size="small"
                    sx={{
                      minWidth: 200,
                      "& .MuiSelect-select": { py: 1 },
                      color: "#f97316",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f97316",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ea580c",
                      },
                    }}
                  >
                    <MenuItem value="receiver">Bên nhận trả phí</MenuItem>
                    <MenuItem value="sender">Bên gửi trả phí</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mr: 1 }}
                  >
                    Tổng phí:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#f97316"
                  >
                    {servicePackage === "light" ? "22.000 đ" : "2.178.000 đ"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", width: "80%", maxWidth: 500 }}>
                  <TextField
                    placeholder="Nhập mã khuyến mại"
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                  />
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#f97316",
                      color: "#f97316",
                      minWidth: 40,
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      height: 40,
                      borderLeft: 0,
                    }}
                  >
                    →
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjc1MzQgOS41MzMwMUw2LjQ1MDMyIDkuMjgyMUw2Ljc3OTQ0IDkuMTIyMjhMOC40OTQ3OSA4LjQ2MzA1TDYuNzkxODMgNy42OTA1M0w2LjQ0OTYzIDcuNTE2MDFMNi42OTE3OCA3LjI0OTk3TDcuNjgwNSA2LjE1MzQyTDYuMjEyNjYgNi4wNzE1NUw1Ljg2NTYxIDYuMDU0ODFMNS44MjU0NiA1LjcwOTc5TDUuNjQ1ODIgMy45ODY3N0w0LjUwMjk5IDUuMjcwMTJMNC4yODEwMyA1LjUyMzk5TDMuOTk5MDQgNS4zMDc5M0wyLjU2NDQyIDNCMEwxLjc0NzgyIDUuNzQ1MzZMMS42MTcxNiA2LjA4Njg2TDEuMjcwMTEgNi4xOTI0NkwwIDYuNjIxNzNMMC45ODUxNDYgNy44Mzg3OUwxLjIyMzY2IDguMTI4OTlMMC45NzIxMSA4LjQwNDI2TDAgOS41MDg5OEwxLjI3OTE0IDkuODMzNTlMMS42Mjk3MiA5LjkyMDYyTDEuNzQ3MTMgMTAuMjY0OUwyLjQ5MTYyIDEyTDMuODcxNDMgMTAuNjcxTDQuMTAwMzQgMTAuNDQ4MUw0LjMzODg3IDEwLjY2MDFMNi4wMTYyNiAxMi4xMTM3TDUuODk5MTMgMTAuMzczNUw1Ljg2NzA0IDEwLjAyNjFMNi4xOTc4NCAxMC4wNTE4TDYuNjc1MzQgOS41MzMwMVoiIGZpbGw9IiNFRjQ0NDQiLz4KPHBhdGggZD0iTTE3LjEyMzcgOS41MDc5OEwxNi4xMzk1IDguMzg5MTdMMTUuODk0NSA4LjEyMDg5TDE2LjE0MDIgNy44NDE0NkwxNy4xMjUgNi42MDk2M0wxNS44NTc5IDYuMTgwMDNMMTUuNTA4MiA2LjA3MDkzTDE1LjM3NjIgNS43MzE1M0wxNC41NTk2IDRMMTMuMTI1IDUuMzA3OTNMMTIuODQ2NCA1LjUyMDY0TDEyLjYyMTQgNS4yNjM0NEwxMS41MTUyIDRMMTEuMzM1NiA1LjcwOTc5TDExLjI5NTQgNi4wNTQ4MUwxMC45NDg0IDYuMDcxNTVMOS40ODAxNiA2LjE4NzkyTDEwLjQ2ODkgNy4yODQ0N0wxMC43MTc5IDcuNTM3NUwxMC4zNzU3IDcuNjkzNTZMOC40OTQ4IDguNDYzMDVMMTAuMjEwMSA5LjEzMTYyTDEwLjU0NTkgOS4yOTgzNkwxMC4zMjA5IDkuNTMzMDFMMTAuOTQ3NyAxMC4wNTE4TDExLjI3ODUgMTAuMDI2MUwxMS4yNDY0IDEwLjM3MzVMMTEuMTI5MyAxMi4xMTM3TDEyLjgwNjcgMTAuNjYwMUwxMy4wNDUyIDEwLjQ0ODFMMTMuMjc0MSAxMC42NzFMMTQuNjU0IDEyTDE1LjM5ODQgMTAuMjY0OUwxNS41MTU4IDkuOTIwNjJMMTUuODY2NCA5LjgzMzU5TDE3LjEyMzcgOS41MDc5OFoiIGZpbGw9IiNGRkQ3MDQiLz4KPHBhdGggZD0iTTEyLjY0NjggNi45MjIzOEwxMS4xODkgNi44NDc4NUwxMC44NTgxIDUuNDcwMjVMMTAuMDAyOSA2LjQ2NjY1TDguNjc1NjUgNi4xMzEyM0w5LjE4MzY0IDcuNDQyODVMOC4wMzc5OCA4LjE2MzM3TDkuMjk0NTQgOC42NjMxNkw4Ljg3OTk5IDEwLjAyODlMMTAuMTY0MSA5LjM0Nzc3TDExLjEyMjcgMTAuMjIxNEwxMS4wNjc3IDguNzY4NjlMMTIuNDA1MiA4LjM3MTk4TDExLjI0ODggNy42NzY2M0wxMi4wMTEzIDYuNjMxNjVMMTIuNjQ2OCA2LjkyMjM4WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg=="
                  alt="GHN"
                  sx={{ width: 24, height: 24, mr: 1 }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "medium", color: "#1976d2" }}
                >
                  Mã khuyến mãi từ GHN
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderColor: "#f97316", color: "#f97316" }}
          >
            Hủy đơn
          </Button>
          <Button
            onClick={handleCreateOrder}
            variant="contained"
            sx={{ bgcolor: "#f97316", "&:hover": { bgcolor: "#ea580c" } }}
          >
            Tạo đơn
          </Button>
        </Box>
      </DialogActions>

      {/* Product List Dialog */}
      <ProductListDialog
        open={productListDialogOpen}
        onClose={() => setProductListDialogOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </>
  );
};

export default CreateOrderForm;
