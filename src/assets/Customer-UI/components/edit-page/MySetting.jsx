import React, { useState } from "react";
import { Typography, Select, Switch, Button, Form, Divider } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

function MySetting() {
  const [language, setLanguage] = useState("EN");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    // Call API to save settings
  };

  return (
    <div
      style={{
        width: "70%",
        margin: "auto",
        padding: "30px",
        backgroundColor: darkMode ? "#333" : "#f9f9f9",
        color: darkMode ? "#fff" : "#000",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography.Title
        level={2}
        style={{ color: darkMode ? "#00BFFF" : "#007BFF", textAlign: "center", marginBottom: "30px" }}
      >
        My Settings
      </Typography.Title>

      <Form layout="vertical">
        <Form.Item label="Language">
          <Select
            value={language}
            onChange={(value) => setLanguage(value)}
            style={{ width: "100%" }}
          >
            <Option value="EN">English</Option>
            <Option value="VI">Tiếng Việt</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Dark Mode">
          <Switch
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
          />
          <span style={{ marginLeft: 10 }}>
            {darkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </Form.Item>


        <Form.Item label="Notifications">
          <Switch
            checked={notifications}
            onChange={(checked) => setNotifications(checked)}
          />
          <span style={{ marginLeft: 10 }}>
            {notifications ? "Enabled" : "Disabled"}
          </span>
        </Form.Item>

        <Divider />

        <Form.Item>
          <Button type="primary" onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </Form.Item>
      </Form>

      <ToastContainer />
    </div>
  );
}

export default MySetting;
