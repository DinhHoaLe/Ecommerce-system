import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import { AdminProvider, useAdminContext } from "./AdminContext";
import Sidebar from "./components/sideBar/sideBar";
import Header from "./components/header/header";
import Dashboard from "./components/dashBoard/dashBoard";
import Products from "./components/products/products";
import Orders from "./components/orders/orders";
import Customers from "./components/customers/customers";
import Reviews from "./components/reviews/reviews";
import Promotion from "./components/promotion/promotion";
import AddProduct from "../Admin-UI/components/addProduct/addProduct";
import Rating from "./components/rating/rating";
import Admin from "./components/admin/admin";
import Quotes from "./components/quotes/quotes";
import AddPromotion from "./components/addPromotion/addPromotion";
import BackUp from "./components/backUp/backUp";
import Setting from "./components/setting/setting";
import Help from "./components/help/help";
import Analytics from "./components/analytics/analytics";
import AddCustomers from "./components/addCustomers/addCustomers";
import { ToastContainer, toast } from "react-toastify";

const AdminUI = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
      navigate("/");
    } else {
      setToken(getToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      callApi();
    }
  }, [token]);

  const callApi = async () => {
    try {
      const req1 = await fetch(
        "http://localhost:8080/api/v1/admin/check-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const res1 = await req1.json();
      if (req1.status === 403 && res1.message === "Invalid or expired token") {
        const req2 = await fetch(
          "http://localhost:8080/api/v1/auth/refresh-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (!req2) throw new Error("Please log in again!");
        const res2 = await req2.json();
        const newToken = res2.accessToken;
        setToken(newToken);
        setCookie("token", newToken, 7);
        const req3 = await fetch(
          "http://localhost:8080/api/v1/admin/check-admin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        const res3 = await req3.json();
        if (res3.message === "Forbidden. Only for admin") {
          return navigate("/");
        }
        if (req3.status === 200) {
          setLoading(false);
        }
      }
      if (req1.status === 403 && res1.message === "Forbidden. Only for admin") {
        return navigate("/");
      }
      if (req1.status === 200) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex w-full ">
      <Sidebar />
      <div className="flex flex-col w-full overflow-hidden ">
        <Header />
        <div>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/addproduct" element={<AddProduct />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/addcustomers" element={<AddCustomers />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/rating" element={<Rating />} />
            <Route path="/promotion" element={<Promotion />} />
            <Route path="/promotion/addpromotion" element={<AddPromotion />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/backup" element={<BackUp />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/help" element={<Help />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

// const App = () => (
//   <AdminProvider>
//     <AdminUI />
//   </AdminProvider>
// );

export default AdminUI;
