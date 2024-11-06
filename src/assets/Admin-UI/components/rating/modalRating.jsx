import React, { useState } from "react";
import { Modal, Table, Input, Select, Image } from "antd";
import { AdminProvider, useAdminContext } from "../../AdminContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { comment } from "postcss";
import { key } from "localforage";

const ModalCustomer = ({
  dataProduct,
  openModal,
  selected,
  setCookie,
  setToken,
  token,
  callRefreshToken,
  callApi,
}) => {
  const [newStatus, setNewStatus] = useState(selected.status);
  const [newReply, setNewReply] = useState();

  const handleCancel = () => {
    openModal(false);
  };

  const handleOk = () => {
    callApi();
  };

  const handleEdit = async (xxx) => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/update-reviews/${xxx._id}`,
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
          `http://localhost:8080/api/v1/update-reviews/${xxx._id}`,
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
          toast.success("Updated successful!", {
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
          onClose: () => callApi(),
        });
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
      toast.error("Failed to update product.", {
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async (xxx) => {
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
          toast.success("Delete Review successful!", {
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
          onClose: () => callApi(),
        });
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
      toast.error("Failed to update product.", {
        autoClose: 3000,
      });
    }
  };

  const columns1 = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: () => selected._id,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: () => selected.title,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: () => (
        <img src={selected.image} style={{ width: "100px", height: "100px" }} />
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: () => (
        <div>
          <div>{selected.totalRating}</div>
        </div>
      ),
    },
    {
      title: "Rating Count",
      dataIndex: "rating",
      key: "rating",
      render: () => (
        <div>
          <div>{selected.countRating}</div>
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: 150,
      render: (text, record) => (
        <div>
          <div>{selected.countComment}</div>
        </div>
      ),
    },
    {
      title: "Reply",
      dataIndex: "comment",
      key: "comment",
      width: 150,
      render: (text, record) => (
        <div>
          <div>{selected.countReply}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: () => {
        return (
          <Select
            style={{ width: "120px" }}
            value={newStatus}
            onChange={(value) => setNewStatus(value)}
          >
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Block">Block</Select.Option>
            <Select.Option value="Block Comment">Block Comment</Select.Option>
            <Select.Option value="Block Rating">Block Rating</Select.Option>
          </Select>
        );
      },
    },
  ];

  const columns2 = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (review, record) => (
        <div style={{ width: "50px" }}>
          {selected.reviewId.map((item, index) => (
            <div key={index} className="py-3">
              {index + 1}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      // width: 150,
      render: (review, record) => (
        <div>
          {selected.reviewId.map((item, index) => (
            <div className="py-3" key={index}>
              {item.comment}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      key: "Rate",
      width: 50,
      render: (review, record) => (
        <div>
          {selected.reviewId.map((item, index) => (
            <div key={index} className="py-3">
              {item.rating}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 200,
      render: (review, record) => (
        <div>
          {selected.reviewId.map((item, index) => (
            <div key={index} className="py-3">
              {item.createdAt.slice(0, 10)}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 100,
      render: (review, record) => (
        <div>
          {selected.reviewId.map((item, index) => (
            <div key={index} className="py-3">
              {item.userId}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      width: 400,
      render: (review, record) => (
        <div>
          {record.reviewId.map((item, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <input
                type="text"
                className="py-2"
                style={{ width: "235px" }}
                value={item.reply.text || ""}
                onChange={(e) => {
                  const updatedReview = [...record.reviewId];
                  updatedReview[index].reply.text = e.target.value;
                  setNewReply(e.target.value);
                }}
              />
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#1677ff",
                  color: "white",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  borderRadius: "5px",
                }}
                onClick={() => handleEdit(item)}
              >
                Save
              </button>
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#1677ff",
                  color: "white",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  paddingTop: "5px",
                  paddingBottom: "5px",
                  borderRadius: "5px",
                }}
                onClick={() => handleDelete(item)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ),
    },
  ];

  // const data1 = [
  //   { key: "1" }, // Row for current information
  // ];

  return (
    <div>
      <Modal
        title="Customer Information"
        open={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        bodyStyle={{ height: 600 }}
      >
        <div style={{ marginBottom: 16 }}>
          <h3>Review Details</h3>
          <Table
            columns={columns1}
            dataSource={[selected]}
            pagination={false}
            showHeader={true}
          />
          <div style={{ overflow: "auto", maxHeight: 400 }}>
            <Table
              columns={columns2}
              dataSource={[selected]}
              pagination={false}
              rowKey="productId"
            />
          </div>
        </div>
      </Modal>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default ModalCustomer;
