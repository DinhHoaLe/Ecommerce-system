import React, { useEffect, useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";

function Authorization({ userData, refreshToken, callApi }) {
  const [form] = Form.useForm();
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [otpForPhone, setOtpForPhone] = useState("");

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };
  useEffect(() => {
    if (!userData || !userData._id) {
      return;
    }
    setPhone(userData.phone);
    setEmail(userData.email);
    setUserName(userData.username);
  }, [userData, form]);

  useEffect(() => {
    const getToken = getCookieValue("token");
    if (!getToken) {
      toast.warn("Please log in to get information!", {
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
    setToken(getToken);
  }, []);

  const onFinish = (values) => {
    console.log("Form values: ", values);
  };

  const sentOtpToPhone = async () => {
    try {
      const req1 = await fetch(
        "http://localhost:8080/api/v1/users/send-verification-phone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone: phone,
          }),
        }
      );
      if (req1.status === 403) {
        const req2 = await refreshToken(token);
        if (!req2) throw new Error("Please log in first!");
        setToken(req2);
        setCookie("token", req2, 7);
        const req3 = await fetch(
          "http://localhost:8080/api/v1/users/send-verification-phone",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${req2}`,
            },
            body: JSON.stringify({
              phone: phone,
            }),
          }
        );
        const res3 = await req3.json();
        if (req3.status === 200) {
          toast.success(res3.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.warn(res3.message, {
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
      }
      if (req1.status === 200) {
        const res1 = await req1.json();
        toast.success(res1.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const verifyPhone = async () => {
    try {
      const req1 = await fetch(
        "http://localhost:8080/api/v1/users/verify-phone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            otp: otpForPhone,
          }),
        }
      );
      if (req1.status === 403) {
        const req2 = await refreshToken(token);
        if (!req2) throw new Error("Please log in first!");
        setToken(req2);
        setCookie("token", req2, 7);
        const req3 = await fetch(
          "http://localhost:8080/api/v1/users/verify-phone",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              otp: otpForPhone,
            }),
          }
        );
        const res3 = await req3.json();
        if (req3.status === 200) {
          callApi();
          toast.success(res3.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.warn(res3.message, {
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
      }
      const res1 = await req1.json();
      if (req1.status === 200) {
        callApi();
        toast.success(res1.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
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
      console.log("error", error);
    }
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
        My Password
      </Typography.Title>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          userName: userName || "", // Đặt giá trị mặc định cho userName ở đây
        }}
      >
        {/* UserName Section */}

        <Form.Item
          name="userName"
          label="UserName"
          rules={[
            {
              type: "string",
              message: "UserName is required",
            },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: "email",
              message: "Email is required",
            },
          ]}
        >
          <Input placeholder="Email" disabled value={email} />
          {userData?.isEmailVerified ? (
            <>
              <small style={{ color: "green" }}>Email verified</small>
              <p style={{ color: "gray" }}>
                You cannot change your email once it is verified.
              </p>
            </>
          ) : (
            <small style={{ color: "red" }}>Email not verified</small>
          )}
        </Form.Item>

        {/* Phone Section */}
        <Form.Item label="Phone Number" required style={{ marginTop: "30px" }}>
          <PhoneInput
            country={"vn"}
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: "100%",
              backgroundColor: userData?.isPhoneVerified ? "#f0f0f0" : "white", // Tô xám khi bị khóa
              color: userData?.isPhoneVerified ? "#888" : "black", // Đổi màu chữ
            }}
            disabled={userData?.isPhoneVerified}
          />
          {userData?.isPhoneVerified ? (
            <>
              <small style={{ color: "green" }}>Phone verified</small>
              <p style={{ color: "gray" }}>
                You cannot change your phone number once it is verified.
              </p>
            </>
          ) : (
            <small style={{ color: "red" }}>Phone not verified</small>
          )}
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button type="primary" style={{ width: "45%" }}>
            Change phone number
          </Button>
          <Button
            type="primary"
            style={{ width: "45%", backgroundColor: "#4CAF50" }}
          >
            Cancel
          </Button>
        </div>

        <Form.Item
          name="otp_phone"
          label="OTP for phone"
          rules={[{ required: true, message: "OTP is required" }]}
        >
          <Input.OTP
            placeholder="OTP"
            onChange={(e) => setOtpForPhone(e.target.value)}
          />
        </Form.Item>

        {/* Buttons for OTP Phone */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            type="primary"
            style={{ width: "45%" }}
            onClick={sentOtpToPhone}
          >
            Send OTP
          </Button>
          <Button
            type="primary"
            style={{ width: "45%", backgroundColor: "#4CAF50" }}
            onClick={verifyPhone}
          >
            Verify Email
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default Authorization;
