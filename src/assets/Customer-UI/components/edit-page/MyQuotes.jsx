import React, { useEffect, useState } from "react";
import { Typography, Table, Image } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyQuotes({ userData, refreshToken, callApi }) {
  const [token, setToken] = useState("");
  const [quotes, setQuotes] = useState([]);

  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  console.log(quotes);
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
    }
    setToken(getToken);
  }, []);

  useEffect(() => {
    if (token) {
      callApiGetQuotes();
    }
  }, [token]);

  const callApiGetQuotes = async () => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/support/${userData.email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req1.status === 403) {
        const newToken = await refreshToken(token);
        if (!newToken) throw new Error("please log in again!");
        setToken(newToken);
        setCookie("token", newToken, 7);
        const req2 = await fetch(
          `http://localhost:8080/api/v1/support/${userData.email}`,
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
          setQuotes(res2.data);
        }
      }
      if (req1.status === 200) {
        const res1 = await req1.json();
        setQuotes(res1.data);
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

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={50} src={text} alt="support image" />,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString().slice(0, 9),
    },
    {
      title: "Reply",
      dataIndex: "reply",
      key: "reply",
      render: (text, record) => <div>{record.reply?.text || ""}</div>,
    },
    {
      title: "Reply At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        return record.reply?.timeReply
          ? new Date(record.reply.timeReply).toLocaleString().slice(0, 9)
          : "";
      },
    },
  ];

  return (
    <div
      style={{
        width: "70%",
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
        My Quotes
      </Typography.Title>
      <Table
        columns={columns}
        dataSource={[quotes]}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        sticky
      />
      <ToastContainer />
    </div>
  );
}

export default MyQuotes;
