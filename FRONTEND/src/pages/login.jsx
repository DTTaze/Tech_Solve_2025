import React, { useContext } from "react";
import { Button, Form, Input,notification } from "antd";
import { loginUserApi } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/layout/auth.context";
const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const onFinish = async (values) => {
    const { email, password } = values;

    const res = await loginUserApi(email, password);
    console.log(res);
    try {
      if (res && res.EC === 0) {
        localStorage.setItem("access_token", res.access_token);
        notification.success({
          message: "Login Success",
          description: "Đã đăng nhập thành công"
        });
        setAuth({
          isAuthenticated: true,
          user: {
            email: res?.user?.email ?? "",
            username: res?.user?.username ?? "",
          },
        });
        navigate("/");
      } else {
        console.log(res?.EM ?? "error");
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div style={{ margin: 50 }}>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
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
    </div>
  );
};
export default LoginPage;
