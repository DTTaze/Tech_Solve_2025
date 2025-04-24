import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const menuItems = [
  {
    text: "Dashboard",
    icon: <DashboardIcon />,
    path: "/customer",
  },
  {
    text: "Profile",
    icon: <PersonIcon />,
    path: "/customer/profile",
  },
  {
    text: "Orders",
    icon: <ShoppingCartIcon />,
    path: "/customer/orders",
  },
  {
    text: "Rewards",
    icon: <CardGiftcardIcon />,
    path: "/customer/rewards",
  },
];

export default function CustomerDrawer({
  drawerWidth,
  open,
  handleDrawerToggle,
  userInfo,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const drawerContent = (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "16px",
          gap: 2,
        }}
      >
        <Avatar
          src={userInfo?.avatar_url}
          alt={userInfo?.full_name}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {userInfo?.full_name || "Customer"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo?.coins || 0} Coins
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: "var(--light-green)",
                  "&:hover": {
                    backgroundColor: "var(--light-green)",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "var(--primary-green)",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid var(--light-green)",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
