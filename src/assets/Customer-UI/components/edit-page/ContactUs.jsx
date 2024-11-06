import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography, Upload } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";

function ContactUs({ userData, refreshToken, callApi }) {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState(""); // Chứa danh sách ảnh đã tải lên

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    if (!userData || !userData._id) {
      return;
    }
    setPhone(userData.phone);
    setEmail(userData.email);
    setUserName(userData.username);
    form.setFieldsValue({
      phone: userData.phone,
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
    });
  }, [userData, form]);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("name", values.name);
      formData.append("message", values.message);
      formData.append("file", images.file);

      const req1 = await fetch("http://localhost:8080/api/v1/support", {
        method: "POST",
        body: formData,
      });
      if (req1.status === 200) {
        toast.success("Sent support successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        const res1 = await req1.json();
        toast.warn(res1.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again.", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleImageUpload = (file) => {
    setImages(file);
  };

  return (
    <div
      style={{
        width: "50%",
        margin: "auto",
        padding: "30px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography.Title
        level={2}
        style={{ color: "#007BFF", textAlign: "center", marginBottom: "30px" }}
      >
        Contact Us
      </Typography.Title>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[
            { required: true, message: "Please enter your phone number!" },
          ]}
        >
          <PhoneInput
            country={"us"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputStyle={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Please enter your message!" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter your message here" />
        </Form.Item>

        <Form.Item label="Upload Images" name="image">
          <Upload
            name="images"
            listType="picture"
            // multiple
            onChange={handleImageUpload}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Send Message
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default ContactUs;
