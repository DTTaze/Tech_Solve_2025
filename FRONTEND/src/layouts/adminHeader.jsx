import React, { useContext, useState } from "react";
import {
  DashboardOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  FileDoneOutlined,
  GiftOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Menu, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [current, setCurrent] = useState("dashboard");

  // Tạo danh sách menu items dựa trên trạng thái đăng nhập
  const items = [
    // ...(auth.isAuthenticated && auth.user.role === "admin"
    ...(auth.isAuthenticated || auth.user.role === "admin"
      ? [
          {
            label: <Link to={"/admin/dashboard"}>Dashboard</Link>,
            key: "dashboard",
            icon: <DashboardOutlined />,
          },
          {
            label: <Link to={"/admin/users"}>Quản lý người dùng</Link>,
            key: "users",
            icon: <UsergroupAddOutlined />,
          },
          {
            label: <Link to={"/admin/tasks"}>Quản lý nhiệm vụ</Link>,
            key: "tasks",
            icon: <FileDoneOutlined />,
          },
          {
            label: <Link to={"/admin/rewards"}>Quản lý phần thưởng</Link>,
            key: "rewards",
            icon: <GiftOutlined />,
          },
          {
            label: <Link to={"/admin/statistics"}>Thống kê</Link>,
            key: "statistics",
            icon: <BarChartOutlined />,
          },
        ]
      : [
          {
            label: <Link to={"/"}>Home Page</Link>,
            key: "home",
            icon: <DashboardOutlined />,
          },
        ]),
    {
      label: `Welcome ${auth?.user?.email ?? ""}`,
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        // ...(auth.isAuthenticated && auth.user.role === "admin"
        ...(auth.isAuthenticated || auth.user.role === "admin"
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      setCurrent("home");
                      notification.success({
                        message: "Đăng xuất thành công!",
                      });
                      setAuth({
                        isAuthenticated: false,
                        user: { email: "", username: "", role: "" },
                      });
                      navigate("/");
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
              },
            ]
          : [
              {
                label: <Link to={"/login"}>Đăng nhập Admin</Link>,
                key: "login",
              },
            ]),
      ],
    },
  ];

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      defaultSelectedKeys={[
        auth.isAuthenticated && auth.user.role === "admin"
          ? "dashboard"
          : "home",
      ]}
      mode="horizontal"
      items={items}
    />
  );
};

export default AdminHeader;
