import React, { useEffect, useState } from "react";
import { Modal, Table, Select } from "antd";
import { ToastContainer, toast } from "react-toastify";

const { Option } = Select;

const ModalOrder = ({
  setModal,
  selected,
  callApi,
  token,
  setToken,
  setCookie,
  callRefreshToken,
}) => {
  const [newStatus, setNewStatus] = useState(selected.status);
  const [dataProduct, setDataProduct] = useState([]);
  const [newProduct, changeNewProduct] = useState(selected.productId._id);
  const [price, setPrice] = useState(selected.productId.price);
  const [firstName, setFirstName] = useState(selected.firstName);
  const [phoneNumber, setPhoneNumber] = useState(selected.phoneNumber);
  const [streetAddress, setStreetAddress] = useState(selected.streetAddress);
  const [townCity, setTownCity] = useState(selected.townCity);
  const [apartment, setApartment] = useState(selected.apartment);
  const [companyName, setCompanyName] = useState(selected.companyName);
  const [quantity, setQuantity] = useState(selected.quantity);

  console.log(selected);
  const handleCancel = () => {
    setModal(false);
  };

  useEffect(() => {
    if (token) {
      callApiProducts();
    }
  }, [token]);

  const callApiProducts = async () => {
    try {
      const req = await fetch("http://localhost:8080/api/v1/products");
      const res = await req.json();
      const result = res.data;
      setDataProduct(result);
    } catch (error) {
      console.error("error", error);
    }
  };

  console.log(selected);
  useEffect(() => {
    if (newProduct && dataProduct.length > 0) {
      const loop1 = dataProduct.find((item) => item._id === newProduct);
      setPrice(loop1.price);
    }
  }, [newProduct]);

  const handleOk = async () => {
    try {
      const req1 = await fetch(
        `http://localhost:8080/api/v1/update-order/${selected._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            firstName: firstName,
            phoneNumber: phoneNumber,
            streetAddress: streetAddress,
            townCity: townCity,
            apartment: apartment,
            companyName: companyName,
            productId: newProduct,
          }),
        }
      );
      if (req1.status === 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setToken(newToken);
        setCookie("token", newToken, 7);
        const req2 = await fetch("http://localhost:8080/api/v1/products", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            firstName: firstName,
            phoneNumber: phoneNumber,
            streetAddress: streetAddress,
            townCity: townCity,
            apartment: apartment,
            companyName: companyName,
            productId: newProduct,
          }),
        });
        if (req2.status === 200) {
          toast.success("Update successful!", {
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
          callApi()
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
        toast.success("Update successful!", {
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
        callApi()
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

  const productColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <select
          value={newProduct}
          onChange={(e) => changeNewProduct(e.target.value)}
        >
          {dataProduct.map((item, index) => (
            <option key={index} value={item._id}>
              {item.title}
            </option>
          ))}
        </select>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => (
        <input type="number" value={price} onChange={setPrice} disabled />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => (
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          // disabled
        />
      ),
    },
    {
      title: "Total Price",
      key: "totalPrice",
      render: (text, record) => <div>{price * quantity}</div>,
    },
  ];

  const orderColumns = [
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (_, record) => (
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{ width: "80px" }}
        />
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => (
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ width: "100px" }}
        />
      ),
    },
    {
      title: "Street",
      dataIndex: "streetAddress",
      key: "streetAddress",
      render: (text) => (
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
      ),
    },
    {
      title: "City",
      dataIndex: "townCity",
      key: "townCity",
      render: (text) => (
        <input
          type="text"
          value={townCity}
          onChange={(e) => setTownCity(e.target.value)}
        />
      ),
    },
    {
      title: "Apartment",
      dataIndex: "apartment",
      key: "apartment",
      render: (text) => (
        <input
          type="text"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />
      ),
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text) => (
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: () => (
        <Select
          value={newStatus}
          onChange={(value) => setNewStatus(value)}
          style={{ width: "150px" }}
        >
          <Option value="Waiting">Waiting</Option>
          <Option value="Confirmed">Confirmed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
  ];

  return (
    <Modal
      title="Order Information"
      open={true}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1200}
      bodyStyle={{ height: 600 }}
    >
      <div style={{ marginBottom: 16 }}>
        <h3>Consignee Information Details</h3>
        <Table
          columns={orderColumns}
          dataSource={[selected]}
          pagination={false}
          rowKey="id"
          style={{ marginBottom: 16 }}
        />
      </div>
      <div>
        <h3>Products</h3>
        <Table
          columns={productColumns}
          dataSource={[selected]}
          pagination={false}
          rowKey="productId"
        />
      </div>
      <ToastContainer />
    </Modal>
  );
};

export default ModalOrder;
