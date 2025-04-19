import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import SecurityIcon from "@mui/icons-material/Security";
import CategoryIcon from "@mui/icons-material/Category";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";


export default function TemporaryDrawer({userInfo}) {
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState("Dashboard");

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const mainMenuItems = [
    { text: "Trang chủ", icon: <DashboardIcon />, section: "dashboard" },
    { text: "Quản lý người dùng", icon: <PeopleIcon />, section: "users" },
    { text: "Phân quyền", icon: <SecurityIcon />, section: "roles" },
    { text: "Đăng tải nội dung", icon: <CategoryIcon />, section: "content" },
    {
      text: "Giao dịch",
      icon: <CurrencyExchangeIcon />,
      section: "transactions",
    },
  ];

  const handleNavigation = (item) => {
    setSelectedItem(item.text);

    // Create a custom event to notify the admin page
    const navigationEvent = new CustomEvent("admin-navigation", {
      detail: {
        section: item.section,
        subsection: item.text,
      },
    });

    window.dispatchEvent(navigationEvent);
    setOpen(false);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      {/* Header with Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
        }}
      >
        {/* <img
          src={Logo || "https://via.placeholder.com/40x40"}
          alt="Logo"
          style={{ height: 40, marginRight: 12 }}
        /> */}
        <Typography variant="h6" fontWeight={600} color="primary">
          Admin Panel
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 1,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            bgcolor: "primary.main",
          }}
          src={userInfo?.avatar_url} 
          alt={userInfo?.username}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {userInfo?.full_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userInfo?.email}
          </Typography>
        </Box>
      </Box>

      {/* Main Navigation */}
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 3, pt: 2, pb: 1 }}
      >
        Main
      </Typography>
      <List disablePadding>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={selectedItem === item.text}
              onClick={() => handleNavigation(item)}
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.12),
                  "&:hover": {
                    backgroundColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.18),
                  },
                },
                "&:hover": {
                  backgroundColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color:
                    selectedItem === item.text ? "primary.main" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    fontWeight={selectedItem === item.text ? 600 : 400}
                    sx={{
                      color:
                        selectedItem === item.text ? "primary.main" : "inherit",
                    }}
                  >
                    {item.text}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      {/* Footer Section with Settings and Logout */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton
        color="primary"
        onClick={toggleDrawer(true)}
        edge="start"
        sx={{ mr: 1 }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            border: "none",
            boxShadow: 6,
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </Box>
  );
}
