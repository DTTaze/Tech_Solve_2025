import React from "react";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import { createUserApi } from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
const RegisterPage = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { username, email, password } = values;
    const res = await createUserApi(username, email, password);
    try {
      if (res) {
        notification.success({
          message: "Register Success",
          description: "Đã đăng ký thành công",
        });
        navigate("/login");
      } else {
        notification.error({
          message: "Register Failed",
          description: "Đăng ký không thành công",
        });
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
          <legend>Đăng ký tài khoản</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Tên tài khoản"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền tên !",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phonenumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                { pattern: /^0\d{9}$/, message: "Số điện thoại phải có 10 số và bắt đầu bằng 0!" }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="CCCD"
              name="CCCD"
              rules={[
                { required: true, message: "Vui lòng nhập CCCD!" },
                { pattern: /^\d{12}$/, message: "CCCD phải có đúng 12 số!" }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Link to={"/"}>
            <ArrowLeftOutlined>Quay lại trang chủ</ArrowLeftOutlined>
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};
export default RegisterPage;
