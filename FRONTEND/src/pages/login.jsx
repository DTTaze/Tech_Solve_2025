import React, { useContext } from "react";
import { Button, Col, Row, Divider, Form, Input, notification } from "antd";
import { loginUserApi } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../layouts/auth.context";
import { ArrowLeftOutlined } from "@ant-design/icons";
const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const res = await loginUserApi(email, password);
      if (res && res.data.EC === 0) {
        localStorage.setItem("access_token", res.data.access_token);
        console.log("Token saved:", localStorage.getItem("access_token"));
        notification.success({
          message: "Login Success",
          description: "Đã đăng nhập thành công",
        });
        setAuth({
          isAuthenticated: true,
          user: {
            email: res.data?.user?.email ?? "",
            username: res.data?.user?.username ?? "",
          },
        });
        navigate("/");
      } else {
        console.log(res.data?.EM ?? "error");
      }
    } catch (e) {
      console.log(e);
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
              label="Email"
              name="email"
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
