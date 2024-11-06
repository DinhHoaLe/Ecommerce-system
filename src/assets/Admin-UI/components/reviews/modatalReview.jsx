import React, { useState } from "react";
import { Modal, Table, Input, Select, Image } from "antd";
import { AdminProvider, useAdminContext } from "../../AdminContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const ModalCustomer = ({
  setModal,
  selected,
  callRefreshToken,
  token,
  setToken,
  setCookie,
  callApi,
}) => {
  const [newStatus, setNewStatus] = useState(selected?.status || "active");
  const [newReply, setNewReply] = useState(selected?.reply.text || "");

  const handleCancel = () => {
    setModal(false);
  };

  const handleOk = async () => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/update-reviews/${selected._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: newReply,
            status: newStatus,
          }),
        }
      );
      if (req1.status === 403) {
        const res2 = await callRefreshToken(token);
        setToken(res2);
        setCookie("token", res2, 7);
        const req3 = await fetch(
          `http://localhost:8080/api/v1/update-reviews/${selected._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${res2}`,
            },
            body: JSON.stringify({
              text: newReply,
              status: newStatus,
            }),
          }
        );
        if (req3.status === 200) {
          callApi();
          toast.success("Updated successful!", {
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
        toast.success("Updated successful!", {
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
      console.error("Error updating product:", error);
      toast.error("Failed to update review.", {
        autoClose: 1500,
      });
    }
  };

  const columns1 = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      render: () => <div style={{ width: 180 }}>{selected._id}</div>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: () => <div style={{ width: 200 }}>{selected.userId.email}</div>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: () => (
        <div style={{ width: 150 }}>{selected.userId.username}</div>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      render: () => (
        <div style={{ width: 100 }}>{selected.userId.lastName}</div>
      ),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: () => (
        <div style={{ width: 100 }}>{selected.userId.firstName}</div>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
      render: () => <div style={{ width: 250 }}>{selected.productId._id}</div>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: () => (
        <div style={{ width: 250 }}>{selected.productId.title}</div>
      ),
    },
    {
      title: "Like",
      dataIndex: "like",
      key: "like",
      render: () => <div style={{ width: 50 }}>{selected.rating}</div>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: () => <div style={{ width: 200 }}>{selected.createdAt}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => (
        <select
          style={{ width: 100 }}
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="block">Block</option>
          <option value="pending">Pending</option>
        </select>
      ),
    },
  ];

  const columns3 = [
    {
      title: "Comment",
      dataIndex: "Comment",
      key: "Comment",
      // width: 250,
      render: (_, record, index) => {
        return index === 1 ? (
          <Input.TextArea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
        ) : (
          <Input.TextArea value={selected.comment} disabled />
        );
      },
    },
  ];

  const data1 = [
    { key: "1" }, // Row for current information
    { key: "2" }, // Row for input fields
  ];

  return (
    <div>
      <Modal
        title="Review Information"
        open={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        bodyStyle={{ height: 600 }}
      >
        <div style={{ marginBottom: 16 }}>
          <h3>User Details</h3>
          <Table
            columns={columns1}
            dataSource={[selected]}
            pagination={false}
            rowKey="id"
            style={{ marginBottom: 16 }}
          />
        </div>
        <div>
          <h3>Products</h3>
          <Table
            columns={columns2}
            dataSource={[selected]}
            pagination={false}
            rowKey="productId"
            style={{ marginBottom: 16 }}
          />
        </div>
        <div>
          <h3>Comment</h3>
          <Table
            columns={columns3}
            dataSource={data1}
            pagination={false}
            rowKey="comment"
            style={{ marginBottom: 16 }}
          />
        </div>
      </Modal>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default ModalCustomer;
