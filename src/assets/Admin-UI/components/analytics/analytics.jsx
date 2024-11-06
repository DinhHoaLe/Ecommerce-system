import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Analytics = () => {
  const [dataOrder, setDataOrder] = useState([]);
  const [token, setToken] = useState("");

  const month = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

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
      return res.accessToken || null;
    } catch (err) {
      console.log("error", err);
      return null;
    }
  };

  useEffect(() => {
    const getToken = getCookieValue("token");
    if (getToken) {
      setToken(getToken);
    } else {
      toast.warn("Please log in first!", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  }, []);

  useEffect(() => {
    if (token) {
      callApi();
    }
  }, [token]);

  const callApi = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/get-all-order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status === 403) {
        const req2 = await callRefreshToken(token);
        if (!req2) throw new Error("Please log in again!");
        setToken(req2);
        setCookie("token", req2, 7);
        const req3 = await fetch("http://localhost:8080/api/v1/get-all-order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${req2}`,
          },
        });
        if (req3.status === 200) {
          const res3 = await req3.json();
          setDataOrder(res3.data);
        }
      } else if (req1.status === 200) {
        const res3 = await req1.json();
        setDataOrder(res3.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const monthlyRevenue = month.map((monthNum) => {
    return dataOrder.reduce((acc, order) => {
      const orderMonth = new Date(order.createdAt).getMonth() + 1;
      return orderMonth === parseInt(monthNum) ? acc + order.amount : acc;
    }, 0);
  });

  const dailyRevenue = dataOrder.reduce((acc, order) => {
    const orderDate = new Date(order.createdAt);
    const currentDate = new Date();
    
    if (
      orderDate.getMonth() === currentDate.getMonth() &&
      orderDate.getFullYear() === currentDate.getFullYear()
    ) {
      const formattedDate = orderDate.toISOString().split("T")[0];
      acc[formattedDate] = (acc[formattedDate] || 0) + order.amount;
    }
    return acc;
  }, {});
  

  const productRevenue = dataOrder.reduce((acc, order) => {
    const productId = order.productId._id;
    acc[productId] = (acc[productId] || 0) + order.amount;
    return acc;
  }, {});

  const productSales = dataOrder.reduce((acc, order) => {
    const productId = order.productId._id;
    acc[productId] = (acc[productId] || 0) + order.quantity;
    return acc;
  }, {});

  const options1 = {
    chart: { id: "monthly-revenue-chart" },
    xaxis: { categories: month },
    yaxis: { min: 0, max: Math.max(...monthlyRevenue) + 50 },
  };
  const series1 = [{ name: "Doanh Thu", data: monthlyRevenue }];

  const options2 = {
    chart: { id: "daily-revenue-chart" },
    xaxis: { categories: Object.keys(dailyRevenue) },
  };
  const series2 = [{ name: "Doanh Thu", data: Object.values(dailyRevenue) }];

  const options3 = {
    chart: { id: "product-revenue-chart" },
    xaxis: { categories: Object.keys(productRevenue) },
  };
  const series3 = [{ name: "Doanh Thu", data: Object.values(productRevenue) }];

  const options4 = {
    chart: { id: "product-sales-chart" },
    xaxis: { categories: Object.keys(productSales) },
  };
  const series4 = [{ name: "Số Lượng Bán", data: Object.values(productSales) }];

  return (
    <div>
      <div className="flex">
        <div className="w-1/2">
          <div className="font-bold">Doanh Thu Từng Tháng</div>
          <Chart options={options1} series={series1} type="bar" height={500} />
        </div>
        <div className="w-1/2">
          <div className="font-bold">Doanh Thu Từng Ngày</div>
          <Chart options={options2} series={series2} type="bar" height={500} />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <div className="font-bold">Doanh Thu Của Từng Sản Phẩm</div>
          <Chart options={options3} series={series3} type="bar" height={500} />
        </div>
        <div className="w-1/2">
          <div className="font-bold">Số Lượng Bán Ra Của Sản Phẩm</div>
          <Chart options={options4} series={series4} type="bar" height={500} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Analytics;
