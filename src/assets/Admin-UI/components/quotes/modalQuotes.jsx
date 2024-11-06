import React, { useState } from "react";
import { Modal, Table, Input, Select, Image } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalQuotes = ({
  openModal,
  selected,
  token,
  setToken,
  setCookie,
  callRefreshToken,
  callApi,
}) => {
  const [newStatus, setNewStatus] = useState(selected.status);
  const [note, setNote] = useState(selected.reply.note);
  const handleCancel = () => {
    openModal(false);
  };

  const handleOk = async () => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/support/${selected._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            note: note,
            status: newStatus,
          }),
        }
      );
      if (req1.status === 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setToken(newToken);
        setCookie(newToken);
        const req2 = await fetch(
          `http://localhost:8080/api/v1/support/${selected._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
            body: JSON.stringify({
              note: note,
              status: newStatus,
            }),
          }
        );
        if (req2.status === 200) {
          toast.success("Updated successful!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => openModal(false),
          });
          callApi();
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
        toast.success("Updated successful!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => openModal(false),
        });
        callApi();
      } else {
        const res1 = await req1.json();
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
      console.log(error);
    }
  };

  const columns1 = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: () => selected._id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: () => selected.name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: () => selected.email,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: () => selected.phone,
    },
    {
      title: "Date Created",
      dataIndex: "dateCreate",
      key: "dateCreate",
      render: (text, record) => (
        <div style={{ width: 100 }}>{record.createdAt.slice(0, 10)}</div>
      ),
    },
  ];

  const columns2 = [
    {
      title: "Admin ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: () => (selected.reply.adminId ? selected.reply.adminId._id : ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: () =>
        selected.reply.adminId ? selected.reply.adminId.email : "",
    },
    {
      title: "Time Reply",
      dataIndex: "time reply",
      key: "time reply",
      width: 150,
      render: () =>
        selected.reply.timeReply ? selected.reply.timeReply.slice(0, 10) : "",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record) => (
        <Input.TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: () => (
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "100px" }}
        >
          <Select.Option value="pending">pending</Select.Option>
          <Select.Option value="approved">approved</Select.Option>
          <Select.Option value="rejected">rejected</Select.Option>
        </Select>
      ),
    },
  ];

  const columns3 = [
    {
      title: "Quotes",
      dataIndex: "quotes",
      key: "quotes",
      // width: 250,
      render: (_, record, index) => {
        return index === 1 ? (
          <Input.TextArea value={selected.reply.text} disabled />
        ) : (
          <div>
            <Input.TextArea value={selected.message} disabled />
          </div>
        );
      },
    },
  ];

  const data = [
    { key: "1" }, // Row for current information
    { key: "2" }, // Row for input fields
  ];

  return (
    <div>
      <Modal
        title="Quotes Information"
        open={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        bodyStyle={{ height: 600 }}
      >
        <div style={{ marginBottom: 16 }}>
          <h3>Quotes Details</h3>
          <Table
            columns={columns1}
            dataSource={[selected]}
            pagination={false}
            rowKey="id"
            style={{ marginBottom: 16 }}
          />
        </div>
        <div>
          <h3>Admin Details</h3>
          <Table
            columns={columns2}
            dataSource={[selected]}
            pagination={false}
            rowKey="admin"
          />
        </div>
        <div>
          <h3>Mail Details</h3>
          <Table
            columns={columns3}
            dataSource={data}
            pagination={false}
            rowKey="mail"
          />
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ModalQuotes;
