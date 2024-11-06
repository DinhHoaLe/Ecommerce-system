import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShoppingCartBody from "../components/shopping-cart/ShoppingCartBody";
import Footer from "../components/Footer";
import ProfilePageBody from "../components/edit-page/ProfilePageBody";
import Sidebar from "../components/edit-page/SildeBarProfile";
import Authorization from "../components/edit-page/Authorization";
import { ToastContainer, toast } from "react-toastify";
import ChangePassword from "../components/edit-page/ChangePassword";
import MyOrder from "../components/edit-page/MyOrder";
import MyPayment from "../components/edit-page/PaymentMethod";
import MyQuotes from "../components/edit-page/MyQuotes";
import ContactUs from "../components/edit-page/ContactUs";
import MyPurchaseHistory from "../components/edit-page/MyPurchaseHistory";
import MyWishList from "../components/edit-page/MyWishList";
import MySetting from "../components/edit-page/MySetting";

function ProfilePage() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [flag, setFlag] = useState(false);

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
    } else {
      setToken(getToken);
    }
  }, []);

  useEffect(() => {
    if (token && !flag) {
      callApi();
      setFlag(true);
    }
  }, [token, flag]);

  const refreshToken = async (xxx) => {
    try {
      const req2 = await fetch(
        "http://localhost:8080/api/v1/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${xxx}`,
          },
        }
      );
      const res2 = await req2.json();
      const newToken = res2.accessToken;
      return newToken;
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApi = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/users/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status === 403) {
        const newToken = await refreshToken(token);
        if (newToken) {
          setToken(newToken);
          setCookie("token", newToken, 7);
          const req3 = await fetch(
            "http://localhost:8080/api/v1/users/profile",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${newToken}`,
              },
            }
          );
          if (req3.status === 200) {
            const res2 = await req3.json();
            setUser(res2);
          }
        }
      }
      if (req1.status === 200) {
        const res1 = await req1.json();
        setUser(res1);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div>
      <Navbar profile={user} />
      {/* Phần header */}
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          maxWidth: "1200px", // Cùng độ rộng với container
          margin: "20px auto",
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ddd", // Đường kẻ dưới header
          borderRadius: "8px 8px 0 0", // Bo tròn góc trên của container
        }}
      >
        <h3 style={{ color: "#007BFF", margin: 0 }}>Manage My Account</h3>
        <h4 style={{ margin: 0 }}>
          Welcome,{" "}
          <span style={{ color: "#007BFF", fontWeight: "bold" }}>
            {user?.username || ""}
          </span>
          !
        </h4>
      </div>
      {/* Container chính */}
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "row", // Chia bố cục thành 2 cột ngang
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "0 0 8px 8px", // Bo tròn góc dưới của container
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow nhẹ để tạo độ nổi
        }}
      >
        <Sidebar /> {/* Sidebar bên trái */}
        <Routes>
          <Route
            path="my-profile"
            element={
              <ProfilePageBody
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-authorization"
            element={
              <Authorization
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-password"
            element={
              <ChangePassword
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-order"
            element={
              <MyOrder
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-payment"
            element={
              <MyPayment
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-quotes"
            element={
              <MyQuotes
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="contact-us"
            element={
              <ContactUs
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-purchase-history"
            element={
              <MyPurchaseHistory
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-wishlist"
            element={
              <MyWishList
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
          <Route
            path="my-setting"
            element={
              <MySetting
                userData={user}
                refreshToken={refreshToken}
                callApi={callApi}
              />
            }
          />
        </Routes>
      </div>
      <Footer />
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
}

export default ProfilePage;
