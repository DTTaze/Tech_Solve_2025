import React from "react";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { createUserApi } from "../utils/api";

const RegisterPage = () => {
  const onFinish = async (values) => {
    const { username, email, password } = values;
    const res = await createUserApi(username, email, password);
    if (res) {
      notification.success({
        message: "Create user",
        description: "Success",
      });
    } else {
      notification.error({
        message: "Create user",
        description: "Failed",
      });
    }
    console.log("Success:", res);
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
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default RegisterPage;
