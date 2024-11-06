import React, { useEffect, useState } from "react";
import { Table, Modal, Dropdown, Menu, Space } from "antd";
import ModalReview from "./modatalReview";
import { DownOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Review = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState([]);

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
    if (getToken) {
      setToken(getToken);
    } else {
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
    }
  }, []);

  useEffect(() => {
    if (token) {
      callApi();
    }
  }, [token]);

  const callApi = async () => {
    try {
      const req = await fetch("http://localhost:8080/api/v1/getReviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await req.json();
      setData(res.data); // Set fetched data to the state
    } catch (error) {
      console.log("error", error);
    }
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

  const deleteReview = async (xxx) => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/reviews/${xxx._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req1.status === 403) {
        const res2 = await callRefreshToken(token);
        setToken(res2);
        setCookie("token", res2, 7);
        const req3 = await fetch(
          `http://localhost:8080/api/v1/update-reviews/${xxx._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${res2}`,
            },
          }
        );
        if (req3.status === 200) {
          callApi();
          toast.success("Delete Review successful!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => setModal(false),
          });
        } else {
          const res3 = await req3.json();
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
        toast.success("Delete Review successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => setModal(false),
        });
        callApi();
      } else {
        const res3 = await req1.json();
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
    } catch (error) {
      toast.error("Failed to delete review.", {
        autoClose: 1500,
      });
    }
  };

  const openModal = (record) => {
    setIsModalOpen(true);
    setSelected(record);
  };

  const setModal = (value) => {
    setIsModalOpen(value);
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="0">
        <button onClick={() => openModal(record)}>Edit</button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <button onClick={() => deleteReview(record)}>Delete</button>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Reviews ID",
      dataIndex: "_id",
      key: "_id",
      fixed: "left",
      width: 100,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "User Email",
      dataIndex: ["userId", "email"],
      key: "email",
      // width: 200,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Username",
      dataIndex: ["userId", "username"],
      key: "username",
      // width: 150,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      // width: 250,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 80,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      // width: 200,
      render: (text) => <div>{new Date(text).toLocaleString()}</div>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (text) => (
        <div>
          <img
            src={text}
            alt="User review"
            style={{ width: 100, height: 100 }}
          />
        </div>
      ),
    },
    {
      title: "Product Title",
      dataIndex: "title",
      key: "title",
      // width: 250,
      render: (text, record) => <div>{record.productId.title}</div>,
    },
    {
      title: "Admin ID",
      dataIndex: "adminId",
      key: "adminId",
      // width: 250,
      render: (text, record) => <div>{record.reply.adminId}</div>,
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
      // width: 250,
      render: (text, record) => <div>{record.reply.text}</div>,
    },
    {
      title: "Status Reply",
      dataIndex: "statusReply",
      key: "statusReply",
      width: 150,
      render: (_, record) => (
        <div>{record.reply.statusReply === true ? "Yes" : "No"}</div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // width: 250,
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <a href="#">
            <Space>
              Action
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{ x: true, y: 950 }}
        sticky
        rowClassName={(record) => {
          switch (record.status) {
            case "active":
              return;
            case "block":
              return "bg-gray-100";
            case "pending":
              return "bg-yellow-100";
            default:
              return "";
          }
        }}
      />
      {isModalOpen && (
        <ModalReview
          setModal={setModal}
          selected={selected}
          token={token}
          setToken={setToken}
          setCookie={setCookie}
          callRefreshToken={callRefreshToken}
          callApi={callApi}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Review;
