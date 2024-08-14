import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Card } from "antd";
import "./Login.css"; 

// Define a type for the form values
interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Type the values parameter
  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    const { username, password } = values;

    if (username === "MuhammadAmin" && password === "1234") {
      localStorage.setItem("auth", "true");
      navigate("/");
      message.success("Login successful");
    } else {
      message.error("Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Form
          name="login"
          layout="vertical"
          onFinish={handleLogin}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="login-button"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
