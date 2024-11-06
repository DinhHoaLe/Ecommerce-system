import React, { useContext, useEffect, useState } from "react";
import { Table, Modal, Dropdown, Menu, Space } from "antd";
import ModalProduct from "./modalProduct";
import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import { AdminProvider, useAdminContext } from "../../AdminContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
// import { v2 as cloudinary } from "cloudinary";
import { ToastContainer, toast } from "react-toastify";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [dataProduct, setDataProduct] = useState([]);
  const [token, setToken] = useState("");

  console.log(dataProduct)
  const openModal = (product) => {
    setIsModalOpen(true);
    setSelectedProduct(product);
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
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
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

  const callApi = async () => {
    try {
      const req = await fetch("http://localhost:8080/api/v1/products");
      const res = await req.json();
      const result = res.data;
      setDataProduct(result);
    } catch (error) {
      console.error("error", error);
    }
  };

  if (!dataProduct || dataProduct.length === 0) {
    return <div>Loading...</div>;
  }

  const delProduct = async (xxx) => {
    try {
      const req = await fetch(
        `http://localhost:8080/api/v1/products/delete-product/${xxx._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req.status === 403) {
        const req2 = callRefreshToken(token);
        if (!req2) throw new Error("Please log in first");
        setToken(req2);
        setCookie("token", req2, 7);
        const req3 = await fetch(
          `http://localhost:8080/api/v1/products/delete-product/${xxx._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${req2}`,
            },
          }
        );
        if (req3.status === 200) {
          toast.success("Delete successful!", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          callApi();
        }
        if (req3.status === 403) {
          const res3 = await req3.status();
          toast.success(res3.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }

      if (req.status === 200) {
        toast.success("Delete successful!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        callApi();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.warn("Error deleting product!", {
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

  const filtersID = dataProduct.map((item) => ({
    text: item._id.toString(),
    value: item._id.toString(),
  }));

  const filtersTitle = dataProduct.map((item) => ({
    text: item.title.toString(),
    value: item.title.toString(),
  }));

  const filtersCategory = [
    { text: "Men's clothing", value: "men's clothing" },
    { text: "Jewelery", value: "jewelery" },
    { text: "Electronics", value: "electronics" },
    { text: "Women's clothing", value: "women's clothing" },
  ];

  const filtersStatus = [
    { text: "Available", value: "available" },
    { text: "Out of stock", value: "out_of_stock" },
    { text: "Discontinued", value: "discontinued" },
    { text: "Pre order", value: "pre_order" },
  ];

  const truncateStyle = {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxHeight: "calc(1.2em * 3)",
    lineHeight: "1.2em",
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="0">
        <button onClick={() => openModal(record)}>Edit</button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1">
        <button onClick={() => delProduct(record)}>Delete</button>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      filters: filtersID,
      fixed: "left",
      // width: 100,
      onFilter: (value, record) => record.id.toString().indexOf(value) === 0,
      sorter: (a, b) => a.id - b.id,
      render: (text, record) => <div>{record._id}</div>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      filters: filtersTitle,
      onFilter: (value, record) => record.title.indexOf(value) === 0,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <div style={{ width: 250 }}>{record.title}</div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: filtersCategory,
      onFilter: (value, record) => record.category.indexOf(value) === 0,
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (text, record) => (
        <div style={{ width: 100 }}>{record.category}</div>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      // filters: filtersCategory,
      onFilter: (value, record) => record.color.indexOf(value) === 0,
      sorter: (a, b) => a.color.localeCompare(b.color),
      render: (text, record) => (
        <div style={{ width: 100 }}>{record.color}</div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      // filters: filtersCategory,
      onFilter: (value, record) => record.brand.indexOf(value) === 0,
      sorter: (a, b) => a.brand.localeCompare(b.brand),
      render: (text, record) => (
        <div style={{ width: 100 }}>{record.brand}</div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      // filters: filtersCategory,
      onFilter: (value, record) => record.quantity.indexOf(value) === 0,
      sorter: (a, b) => a.quantity.localeCompare(b.quantity),
      render: (text, record) => (
        <div style={{ width: 100 }}>{record.quantity}</div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      // filters: filtersCategory,
      onFilter: (value, record) => record.slug.indexOf(value) === 0,
      sorter: (a, b) => a.slug.localeCompare(b.slug),
      render: (text, record) => <div>{record.slug}</div>,
    },
    {
      title: "Sku",
      dataIndex: "sku",
      key: "sku",
      // filters: filtersCategory,
      onFilter: (value, record) => record.sku.indexOf(value) === 0,
      sorter: (a, b) => a.sku.localeCompare(b.sku),
      render: (text, record) => <div>{`/${record.sku}`}</div>,
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      // filters: filtersCategory,
      onFilter: (value, record) => record.isFeatured.indexOf(value) === 0,
      sorter: (a, b) => a.isFeatured.localeCompare(b.isFeatured),
      render: (text, record) => <div>{record.isFeatured.toString()}</div>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <div style={{ width: 100 }}>
          <img
            // src={`https://res.cloudinary.com/dsxlqhn53/image/upload/${record.image}`}
            src={record.image}
            alt={record.title}
            style={{ width: "100px", height: "100px" }}
          />
        </div>
      ),
    },

    {
      title: "Price ( $ )",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (text, record) => <div style={{ width: 80 }}>{record.price}</div>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount - b.discount,
      render: (text, record) => (
        <div style={{ width: 80 }}>{record.discount}</div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <div style={{ width: 200 }}>
          <p style={truncateStyle}>{record.description}</p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert(record.description);
            }}
          >
            Read more
          </a>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      filters: filtersStatus,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (text, record) => (
        <div style={{ width: 100 }}>{record.status}</div>
      ),
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
        dataSource={dataProduct}
        rowKey="id"
        scroll={{ x: true, y: 950 }}
        // style={{ maxWidth: 1080 }}
        sticky
        rowClassName={(record) => {
          switch (record.status) {
            case "available":
              return;
            case "out_of_stock":
              return "bg-red-100";
            case "discontinued":
              return "bg-yellow-100";
            case "pre_order":
              return "bg-gray-100";
            default:
              return "";
          }
        }}
      />
      {isModalOpen && (
        <ModalProduct
          openModal={setIsModalOpen}
          selectedProduct={selectedProduct}
          callApi={callApi}
          callRefreshToken={callRefreshToken}
          token={token}
          setToken={setToken}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Products;
