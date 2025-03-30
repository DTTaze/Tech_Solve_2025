import React, { useContext } from "react";
import { Button, Col, Row, Divider, Form, Input, notification } from "antd";
import { loginUserApi } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth.context";
import { ArrowLeftOutlined } from "@ant-design/icons";
const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const onFinish = async (values) => {
    try {
      const { identifier, password } = values;
      const isEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(
        identifier
      );
      let loginData = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await loginUserApi(loginData);

      if (res && res.status === 200) {
        localStorage.setItem("access_token", res.data.access_token);
        console.log( res.data);
        notification.success({
          message: "Login Success",
          description: "Đã đăng nhập thành công",
        });

        setAuth({
          isAuthenticated: true,
          user: {
            email: res.data.user?.email ?? "",
            username: res.data.user?.username ?? "",
          },
        });

        navigate("/");
      } else {
        notification.error({
          message: "Đăng nhập thất bại",
          description: res.error || "Đã xảy ra lỗi, vui lòng thử lại!",
        });
      }
    } catch (error) {
      notification.error({
        message: "Đăng nhập thất bại",
        description: error.message || "Đã xảy ra lỗi, vui lòng thử lại!",
      });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đăng nhập</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email/Username"
              name="identifier"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
          <Link to={"/"}>
            <ArrowLeftOutlined>Quay lại trang chủ</ArrowLeftOutlined>
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};
export default LoginPage;
