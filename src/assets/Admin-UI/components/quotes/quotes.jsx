import React, { useEffect, useState } from "react";
import { Table, Modal, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ModalQuotes from "./modalQuotes";
import { ToastContainer, toast } from "react-toastify";
import ModalEmail from "./modalEmail";

const Quotes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEmail, setIsModalOpenEmail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [token, setToken] = useState("");
  const [dataQuotes, setDataQuotes] = useState([]);

  console.log(dataQuotes);
  const openModal = (record) => {
    setIsModalOpen(true);
    setSelected(record);
  };

  const openModalEmail = (record) => {
    setIsModalOpenEmail(true);
    setSelected(record);
  };

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
      toast.warn("Please log in first!", {
        position: "top-center",
        autoClose: 1500,
      });
    } else {
      setToken(getToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      callApi();
    }
  }, [token]);

  const callRefreshToken = async (oldToken) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${oldToken}`,
          },
        }
      );
      const result = await response.json();
      return result.accessToken;
    } catch (err) {
      console.log("error", err);
      return null;
    }
  };

  const callApi = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/support", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setToken(newToken);
        setCookie("token", newToken, 7);
        const retryResponse = await fetch(
          "http://localhost:8080/api/v1/support",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        if (retryResponse.status === 200) {
          const data = await retryResponse.json();
          setDataQuotes(data.data);
        }
      } else if (response.status === 200) {
        const data = await response.json();
        setDataQuotes(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteSupport = async (xxx) => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/support/${xxx._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req1.status === 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setToken(newToken);
        setCookie("token", newToken, 7);

        const req2 = await fetch(
          `http://localhost:8080/api/v1/support/${xxx._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        if (req2.status === 200) {
          toast.success("Delete successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => callApi(),
          });
        } else {
          const res2 = await req2.json();
          toast.warn(res2.message, {
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
        toast.success("Delete successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => callApi(),
        });
      } else {
        const res2 = await req1.json();
        toast.warn(res2.message, {
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
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      // width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      // width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      // width: 150,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      // width: 300,
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      // width: 300,
      render: (text, record) => record.createdAt.slice(0, 10),
    },
    {
      title: "Reply",
      key: "reply",
      render: (text, record) =>
        record.reply && record.reply.statusReply ? "Yes" : "No",
    },
    {
      title: "Time Reply",
      dataIndex: "timeReply",
      key: "timeReply",
      // width: 300,
      render: (text, record) =>
        record.reply.timeReply ? record.reply.timeReply.slice(0, 10) : "",
    },
    {
      title: "Note",
      key: "note",
      render: (text, record) => record.reply.note,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (text, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="0">
                <button onClick={() => openModal(record)}>Edit</button>
              </Menu.Item>
              <Menu.Item key="1">
                <button onClick={() => openModalEmail(record)}>Reply</button>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="3">
                <button onClick={() => deleteSupport(record)}>Delete</button>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
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
    <div className="overflow-hidden">
      <Table
        columns={columns}
        dataSource={dataQuotes}
        rowKey="_id"
        scroll={{ x: 1200, y: 950 }}
        sticky
        rowClassName={(record) => {
          switch (record.status) {
            case "available":
              return;
            case "pending":
              return "bg-red-100";
            case "approved":
              return "bg-yellow-100";
            case "rejected":
              return "bg-gray-100";
            default:
              return "";
          }
        }}
      />
      {isModalOpen && (
        <ModalQuotes
          openModal={setIsModalOpen}
          selected={selected}
          token={token}
          setToken={setToken}
          setCookie={setCookie}
          callRefreshToken={callRefreshToken}
          callApi={callApi}
        />
      )}
      {isModalOpenEmail && (
        <ModalEmail
          openModal={setIsModalOpenEmail}
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

export default Quotes;
