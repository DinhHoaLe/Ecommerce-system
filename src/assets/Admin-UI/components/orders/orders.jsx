import React, { useEffect, useState } from "react";
import { Table, Modal, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import ModalOrder from "./modalOrder";
import { ToastContainer, toast } from "react-toastify";
import ModalBill from "./modalBill";
import ModalEmailOrder from "./modalEmail";

const Orders = () => {
  const [selected, setSelected] = useState();
  const [modal, setModal] = useState(false);
  const [bill, setBill] = useState(false);
  const [modalEmail, setModalEmail] = useState(false);
  const [token, setToken] = useState("");
  const [dataOrder, setDataOrder] = useState([]);

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
      const req1 = await fetch("http://localhost:8080/api/v1/get-all-order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (req1.status === 403) {
        const newToken = await callRefreshToken(token);
        if (newToken) {
          setToken(newToken);
          setCookie("token", newToken, 7);
          const req2 = await fetch(
            "http://localhost:8080/api/v1/get-all-order",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${newToken}`,
              },
            }
          );
          if (req2.status === 200) {
            const res = await req2.json();
            setDataOrder(res.data);
          }
        }
      }
      if (req1.status === 200) {
        const res = await req1.json();
        setDataOrder(res.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 150,
    },
    {
      title: "Customer Infor",
      dataIndex: "Customer Infor",
      key: "Customer Infor",
      render: (text, record) => {
        return (
          <div>
            <div>{`First Name : ${record.userId.firstName}`}</div>
            <div>{`Last Name : ${record.userId.lastName}`}</div>
            <div>{`Gender : ${record.userId.gender}`}</div>
            <div>{`DOB : ${record.userId.dateOfBirth.slice(0, 10)}`}</div>
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Contact Customer",
      dataIndex: "Contact Customer",
      key: "Contact Customer",
      render: (text, record) => {
        return (
          <div>
            <div>{`Email : ${record.userId.email}`}</div>
            <div>{`UserName : ${record.userId.username}`}</div>
            <div>{`Phone : ${record.userId.phone}`}</div>
          </div>
        );
      },
      width: 200,
    },
    {
      title: "Customer Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      // width: 200,
      render: (text, record) => {
        return (
          <div>
            <div>{`Street: ${record.userId.address.number}`}</div>
            <div>{`Ward: ${record.userId.address.ward}`}</div>
            <div>{`District: ${record.userId.address.district}`}</div>
            <div>{`City : ${record.userId.address.city}`}</div>
          </div>
        );
      },
    },
    {
      title: "Delivery Address",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      // width: 200,
      render: (text, record) => {
        return (
          <div>
            <div>{`Name: ${record.firstName} ${record.lastName}`}</div>
            <div>{`Street: ${record.streetAddress}`}</div>
            <div>{`City : ${record.townCity}`}</div>
            <div>{`Apartment : ${record.apartment}`}</div>
            <div>{`Compnay Name : ${record.companyName}`}</div>
            <div>{`Delivery phone : ${record.phoneNumber}`}</div>
          </div>
        );
      },
    },
    {
      title: "Product Infor",
      dataIndex: "productId",
      key: "productId",
      render: (text, record) => {
        return (
          <div>
            <div>{`Title: ${record.productId?.title || "N/A"}`}</div>
            <div>{`Category : ${record.productId?.category || "N/A"}`}</div>
            <div>{`OPD : ${
              record.deliveryId?.orderPlacedDate.slice(0, 10) || "N/A"
            }`}</div>
          </div>
        );
      },
      width: 300,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Price",
      dataIndex: "productId",
      key: "price",
      render: (text, record) => `$${record.productId?.price}`,
      width: 100,
    },
    {
      title: "Total Bill",
      key: "totalPrice",
      render: (text, record) => `$${record.productId?.price * record.quantity}`,
      width: 150,
    },
    {
      title: "Delivery Infor",
      dataIndex: "deliveryId",
      key: "deliveryId",
      render: (text, record) => {
        return (
          <div>
            <div>{`Delivery ID : ${record.deliveryId?._id || "N/A"}`}</div>
            <div>{`EDD : ${
              record.deliveryId?.deliveryDate.slice(0, 10) || "N/A"
            }`}</div>
          </div>
        );
      },
      // width: 300,
    },
    {
      title: "Consignee Infor",
      dataIndex: "deliveryAddress",
      key: "deliveryAddress",
      // width: 200,
      render: (text, record) => {
        return (
          <div>
            <div>{`Name: ${record.firstName} ${record.lastName}`}</div>
            <div>{`Phone : ${record.phoneNumber}`}</div>
            <div>{`ROD : ${
              record.deliveryId?.orderReceivedDate.slice(0, 10) || "N/A"
            }`}</div>
          </div>
        );
      },
    },
    {
      title: "Delivery Status",
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
      width: 150,
      render: (text, record) => {
        return <div>{record.deliveryId.deliveryStatus}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
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

  const menu = (record) => (
    <Menu>
      <Menu.Item key="0">
        <button onClick={() => openModal(record)}>Edit</button>
      </Menu.Item>
      <Menu.Item key="1">
        <button onClick={() => openBill(record)}>Bill</button>
      </Menu.Item>
      <Menu.Item key="2">
        <button onClick={() => openEmail(record)}>Mail</button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">
        <button>Delete</button>
      </Menu.Item>
    </Menu>
  );

  const openModal = (record) => {
    setSelected(record);
    setModal(true);
  };

  const openBill = (record) => {
    setSelected(record);
    setBill(true);
  };

  const openEmail = (record) => {
    setSelected(record);
    setModalEmail(true);
  };

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={dataOrder}
        rowKey={(record) => record._id}
        scroll={{ x: true, y: 950 }}
        sticky
        rowClassName={(record) => {
          switch (record.status) {
            case "Waiting":
              return "bg-gray-100";
            case "Confirmed":
              return "bg-red-100";
            case "Cancelled":
              return "bg-yellow-100";
            default:
              return "";
          }
        }}
      />
      {modal && (
        <ModalOrder
          setModal={setModal}
          selected={selected}
          token={token}
          setCookie={setCookie}
          setToken={setToken}
          callRefreshToken={callRefreshToken}
          callApi={callApi}
        />
      )}
      {bill && (
        <ModalBill setBill={setBill} selected={selected} token={token} />
      )}
      {modalEmail && (
        <ModalEmailOrder
          setModalEmail={setModalEmail}
          selected={selected}
          token={token}
          setCookie={setCookie}
          setToken={setToken}
          callRefreshToken={callRefreshToken}
          callApi={callApi}
        />
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Orders;
