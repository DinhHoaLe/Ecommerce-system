import React, { useEffect, useState } from "react";
import { Modal, Table, Input, Select, Typography, Upload, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const ModalEmailOrder = ({
  setModalEmail,
  selected,
  setCookie,
  token,
  setToken,
  callRefreshToken,
  callApi,
}) => {
  const [replyText, setReplyText] = useState("");
  const [adminInfor, setAdminInfor] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState([null]);

  const handleCancel = () => {
    setModalEmail(false);
  };

  useEffect(() => {
    if (token) {
      const getInfor = jwtDecode(token);
      setAdminInfor(getInfor.email);
    } else {
      throw new Error("please log in first!");
    }
  }, [token]);

  const handleFileChange = (info) => {
    setFile(info.file.originFileObj);
  };

  console.log(file);

  const handleOk = async () => {
    try {
      const formData = new FormData();
      formData.append("text", replyText);
      formData.append("summary", summary);
      if (file) formData.append("file", file);
      const req1 = await fetch(
        `http://localhost:8080/api/v1/email/${selected.userId._id}`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (req1.status === 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setToken(newToken);
        setCookie("token", newToken, 7);
        const req2 = await fetch(
          `http://localhost:8080/api/v1/email/${selected.userId._id}`,
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${newToken}`,
            },
            body: formData,
          }
        );
        if (req2.status === 200) {
          toast.success("Send email successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => setModalEmail(false),
          });
          callApi();
        }
      } else if (req1.status === 200) {
        toast.success("Send email successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => setModalEmail(false),
        });
        callApi();
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

  return (
    <div>
      <Modal
        title="Send Email"
        open={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        bodyStyle={{ padding: 20 }}
      >
        <div>
          <Title level={4}>User's Information Order</Title>
          <Text>ID Order : {selected._id}</Text>
        </div>
        <div style={{ marginBottom: 20 }}>
          <Text>
            Name : {selected.userId.firstName} {selected.userId.lastName}
          </Text>
        </div>
        <div style={{ marginBottom: 20 }}>
          <Title level={4}>User Information</Title>
          <Text strong> User's Email: </Text>
          <Input value={selected.userId.email} disabled />
        </div>

        <div style={{ marginBottom: 20 }}>
          <Title level={4}>Admin Response</Title>
          <Text strong> Admin's Email: </Text>
          <Input value={adminInfor} disabled />
          <Text strong>Summary: </Text>
          <Input onChange={(e) => setSummary(e.target.value)} />
          <Text strong>Description: </Text>
          <TextArea
            rows={4}
            placeholder="Write your reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ marginBottom: 10 }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <Title level={4}>Attach File</Title>
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ModalEmailOrder;
