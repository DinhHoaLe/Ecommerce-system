import React, { useEffect, useState } from "react";
import { AdminProvider, useAdminContext } from "../../AdminContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard({}) {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [dataSupport, setDataSupport] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataPromotion, setDataPromotion] = useState([]);

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

  const callRefreshToken = async (xxx) => {
    try {
      const req = await fetch(
        "http://localhost:8080/api/v1/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${xxx}`,
          },
        }
      );
      const res = await req.json();
      const newToken = res.accessToken;
      return newToken;
    } catch (err) {
      console.log("error", err);
      return null;
    }
  };

  useEffect(() => {
    const getToken = getCookieValue("token");
    if (!getToken) {
      toast.warn("Please log in first!", {
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
    if (token) {
      callApiUsers();
      callApiQuotes();
      callApiOrders();
      callApiProducts();
      callApiPromotions();
    }
  }, [token]);

  const callApiUsers = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/admin/get-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch(
          "http://localhost:8080/api/v1/admin/get-users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataUser(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataUser(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiOrders = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/get-all-order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch("http://localhost:8080/api/v1/get-all-order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${newToken}`,
          },
        });
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataOrder(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataOrder(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiPromotions = async () => {
    try {
      const req1 = await fetch(
        "http://localhost:8080/api/v1/promotion/get-promotion",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch(
          "http://localhost:8080/api/v1/promotion/get-promotion",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataPromotion(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataPromotion(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiQuotes = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/support", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch("http://localhost:8080/api/v1/support", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${newToken}`,
          },
        });
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataSupport(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataSupport(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiProducts = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // authorization: `Bearer ${token}`,
        },
      });
      if (req1.status === 201) {
        const res2 = await req1.json();
        setDataProduct(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const orderTab = () => {
    navigate("/orders");
  };
  const customresTab = () => {
    navigate("/customers");
  };
  const productsTab = () => {
    navigate("/products");
  };
  const quotesTab = () => {
    navigate("/quotes");
  };
  const promotionTab = () => {
    navigate("/promotion");
  };
  const analyticsTab = () => {
    navigate("/analytics");
  };

  const totalSale = dataOrder.reduce((total, item) => {
    return total + item.quantity * item.productId.price;
  }, 0);

  const totalBill = dataOrder
    .map((item) => {
      return { ...item, totalBill: item.quantity * item.productId.price };
    })
    .sort((a, b) => {
      return b.totalBill - a.totalBill;
    });

  return (
    <div className="p-6 bg-gray-50 flex-grow overflow-auto">
      <div className="grid grid-cols-3 gap-4">
        <div
          className="col-span-1 bg-white p-4 rounded-md shadow-md flex flex-col cursor-pointer"
          onClick={analyticsTab}
        >
          <h3 className="text-lg font-semibold">Total Sales ($)</h3>
          <p className="text-2xl font-bold">{totalSale}</p>
        </div>
        <div
          className="col-span-1 bg-white p-4 rounded-md shadow-md flex flex-col cursor-pointer"
          onClick={customresTab}
        >
          <h3 className="text-lg font-semibold">Total Customers</h3>
          <p className="text-2xl font-bold">{dataUser.length}</p>
        </div>
        <div
          className="col-span-1 bg-white p-4 rounded-md shadow-md flex flex-col cursor-pointer"
          onClick={orderTab}
        >
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold">{dataOrder.length}</p>
        </div>
        <div
          className="col-span-1 bg-white p-4 rounded-md shadow-md flex flex-col cursor-pointer"
          onClick={productsTab}
        >
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl font-bold">{dataProduct.length}</p>
        </div>
        <div
          className="col-span-1 bg-white p-4 rounded-md shadow-md flex flex-col cursor-pointer"
          onClick={quotesTab}
        >
          <h3 className="text-lg font-semibold">Total Quotes</h3>
          <p className="text-2xl font-bold">{dataSupport.length}</p>
        </div>
        <div
          className="col-span-1 bg-white p-4 rounded-md shadow-md flex flex-col cursor-pointer"
          onClick={promotionTab}
        >
          <h3 className="text-lg font-semibold">Total Promotion</h3>
          <p className="text-2xl font-bold">{dataPromotion.length}</p>
        </div>
        <div
          className="col-span-3 bg-white p-4 rounded-md shadow-md cursor-pointer"
          onClick={analyticsTab}
        >
          <h3 className="text-lg font-semibold">Best Selling In Month</h3>
          {totalBill.slice(0, 3).map((item, index) => (
            <ul key={index} className="mt-4 space-y-2">
              <li>
                {item.productId.title} -{" "}
                <span className="font-semibold text-red-500">
                  ${item.totalBill}
                </span>
              </li>
            </ul>
          ))}
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default Dashboard;
