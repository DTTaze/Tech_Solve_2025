import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

export default function CustomerAppBar({
  open,
  drawerWidth,
  handleDrawerToggle,
}) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/customer") return "Dashboard";
    if (path === "/customer/profile") return "Profile";
    if (path === "/customer/orders") return "Orders";
    if (path === "/customer/rewards") return "Rewards";
    return "Customer Portal";
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        borderBottom: "1px solid var(--light-green)",
        width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
        ml: { sm: `${open ? drawerWidth : 0}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, color: "var(--text-dark)" }}
        >
          <MenuIcon />
        </IconButton>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
          <Typography color="text.primary">{getPageTitle()}</Typography>
        </Breadcrumbs>
      </Toolbar>
    </AppBar>
  );
}
