import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Select, Button } from "antd";
import { jwtDecode } from "jwt-decode";
import convertNumberToWords from "./concvertNumToChar";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const { Option } = Select;

const ModalBill = ({ setBill, selected, token }) => {
  const [admin, setAdmin] = useState({});
  const invoiceRef = useRef();

  console.log(selected);
  const handleCancel = () => {
    setBill(false);
  };

  const handleOk = () => {
    alert("Cập nhật thành công!");
  };

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    pdf.save("invoice.pdf");
  };

  const productColumns = [
    {
      title: "Title",
      dataIndex: "selected.productId.title",
      key: "title",
      width: 350,
      render: (text, record) => <div>{record.productId.title}</div>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => <div>{record.productId.price}</div>,
    },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Total",
      key: "totalPrice",
      render: (text, record) => (
        <span>
          {(record.quantity * record.productId.price).toLocaleString()} $
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (token) {
      const adminInfor = jwtDecode(token);
      setAdmin(adminInfor);
    }
  }, [token]);

  const printTime = new Date().toString();
  const totalAmount = selected.quantity * selected.productId.price;
  const totalQuantity = selected.quantity;

  return (
    <Modal
      title="Order Information"
      open={true}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      bodyStyle={{ padding: "20px" }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="download" type="primary" onClick={handleDownloadPDF}>
          Export PDF
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
    >
      <div
        ref={invoiceRef}
        style={{ width: "100%", fontFamily: "Arial, sans-serif" }}
      >
        <h1 style={{ textAlign: "center" }}>HÓA ĐƠN BÁN HÀNG</h1>

        <div style={{ marginBottom: "0px" }}>
          <p style={{ height: "40px" }}>
            Ngày: {new Date(selected.updatedAt).toLocaleDateString()}
          </p>
          <p style={{ height: "40px" }}>Số phiếu: {selected._id}</p>
          <p style={{ height: "40px" }}>Thu ngân: {admin.admin}</p>
          <p style={{ height: "40px" }}>In lúc: {printTime}</p>
        </div>

        <div style={{ marginBottom: "0px" }}>
          <p style={{ height: "40px" }}>
            Khách hàng: {selected.userId.lastName} {selected.userId.firstName}
          </p>
          <p>
            Địa chỉ: {selected.userId.address.number}{" "}
            {selected.userId.address.ward} {selected.userId.address.district}{" "}
            {selected.userId.address.city}
          </p>
        </div>

        <Table
          columns={productColumns}
          dataSource={[selected]}
          pagination={false}
          rowKey="title"
          summary={() => (
            <>
              <Table.Summary.Row style={{ backgroundColor: "#f0f0f0" }}>
                <Table.Summary.Cell colSpan={2} style={{ fontWeight: "bold" }}>
                  Tổng cộng
                </Table.Summary.Cell>
                <Table.Summary.Cell style={{ fontWeight: "bold" }}>
                  {totalQuantity.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell style={{ fontWeight: "bold" }}>
                  {totalAmount.toLocaleString()} $
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row style={{ backgroundColor: "#e0e0e0" }}>
                <Table.Summary.Cell colSpan={2} style={{ fontWeight: "bold" }}>
                  Tổng cộng bằng chữ
                </Table.Summary.Cell>
                <Table.Summary.Cell style={{ fontWeight: "bold" }}>
                  {convertNumberToWords(totalQuantity)}
                </Table.Summary.Cell>
                <Table.Summary.Cell style={{ fontWeight: "bold" }}>
                  {convertNumberToWords(totalAmount)} đô
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
        />

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Xin cảm ơn Quý khách! Thank you!
        </p>
      </div>
    </Modal>
  );
};

export default ModalBill;
