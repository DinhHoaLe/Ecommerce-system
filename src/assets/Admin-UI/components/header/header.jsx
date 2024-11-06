import React, { useEffect, useState, useRef } from "react";
import icon from "../svg/logout-2-svgrepo-com.svg";
import { AdminProvider, useAdminContext } from "../../AdminContext";
import { Navigate } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import dataSideBar from "../data/dataSideBar";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu } from "antd";
import { downloadExcel } from "react-export-table-to-excel";

function Header({ test }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [token, setToken] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [dataSupport, setDataSupport] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [dataPromotion, setDataPromotion] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState("");

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
      // setToken(getToken);
      setToken(getToken);
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (token) {
      setUser(jwtDecode(token));
    }
  }, [token]);

  const searchInput = (e) => {
    setSearch(e.target.value);
  };

  const deleteCookie = (name) => {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const logOut = () => {
    deleteCookie("token");
    toast.warn("Log out successful", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      onClose: () => navigate("/login"),
    });
  };

  const addProduct = () => {
    navigate("/admin/products/addproduct");
  };

  const addPromotion = () => {
    navigate("/admin/promotion/addpromotion");
  };

  const addCustomers = () => {
    navigate("/admin/customers/addcustomers");
  };

  const exelUser = () => {
    const header = [
      "ID",
      "Email",
      "User",
      "Password",
      "First Name",
      "Last Name",
      "Phone",
      "Birthday",
      "Image",
      "Gender",
      "Rank",
      "City",
      "Street",
      "Number",
      "Zipcode",
      "Phone Verified",
      "Email Verified",
    ];

    const mapDataToHeader = (item) => {
      return {
        ID: item._id,
        Email: item.email,
        User: item.username,
        Password: item.password,
        "First Name": item.firstName,
        "Last Name": item.lastName,
        Phone: item.phone,
        Birthday: item.dateOfBirth,
        Image: item.avatar,
        Gender: item.gender ? "Male" : "Female",
        Rank: item.rank,
        City: item.address.city,
        Street: item.address.ward,
        Number: item.address.number,
        Zipcode: item.zipcode,
        "Phone Verified": item.isPhoneVerified,
        "Email Verified": item.isEmailVerified,
      };
    };

    const sortedData = dataUser.map(mapDataToHeader);

    function handleDownloadExcel() {
      downloadExcel({
        fileName: "exelUser -> downloadExcel method",
        sheet: "rexelUser",
        tablePayload: {
          header,
          // accept two different data structures
          body: sortedData,
        },
      });
    }
    handleDownloadExcel();
  };

  const exportProducts = () => {
    const header = [
      "ID",
      "Title",
      "Category",
      "Color",
      "Brand",
      "Quantity",
      "Slug",
      "Sku",
      "Featured",
      "Image",
      "Price ( $ )",
      "Discount",
      "Description",
      "Status",
    ];

    const mapDataToHeader = (item) => {
      return {
        ID: item._id,
        Title: item.title,
        Category: item.category,
        Color: item.color,
        Brand: item.brand,
        Quantity: item.quantity,
        Slug: item.slug,
        Sku: item.sku,
        Featured: item.featured,
        Image: item.image,
        Price: item.price,
        Discount: item.discount,
        Description: item.description,
        Status: item.status,
      };
    };

    const sortedData = dataProduct.map(mapDataToHeader);

    function handleDownloadExcel() {
      downloadExcel({
        fileName: "exportProducts-> downloadExcel method",
        sheet: "exportProducts",
        tablePayload: {
          header,
          // accept two different data structures
          body: sortedData,
        },
      });
    }
    handleDownloadExcel();
  };

  const exportOrder = () => {
    const header = [
      "Order ID",
      "FristName Customer Order",
      "LastName Customer Order",
      "Gender Customer Order",
      "DOB Customer Order",
      "Email Customer Order",
      "UserName  Customer Order",
      "Number Customer Order",
      "Ward Customer Order",
      "District Customer Order",
      "City Customer Order",
      "Name Customer Receive",
      "Street Customer Receive",
      "City Customer Receive",
      "Apartment Customer Receive",
      "Company Name Customer Receive",
      "Phone Customer Receive",
      "Title Product",
      "Category Product",
      "Price Product",
      "Quantity Product",
      "Delivery Status",
      "Status",
    ];

    const mapDataToHeader = (item) => {
      return {
        ID: item._id,
        firstNameO: item.userId.firstName,
        lastNameO: item.userId.lastName,
        genderO: item.userId.gender,
        DOBO: item.userId.dateOfBirth.slice(0, 10),
        emailO: item.userId.email,
        usernameO: item.userId.username,
        phoneO: item.userId.phone,
        numberO: item.userId.number,
        wardO: item.userId.ward,
        districtO: item.userId.district,
        cityO: item.userId.city,
        nameR: item.firstName,
        streetR: item.streetAddress,
        cityR: item.townCity,
        apartmentR: item.apartment,
        companyNameR: item.companyName,
        phoneNumber: item.phoneNumber,
        title: item.productId.title,
        category: item.productId.category,
        Price: item.productId.Price,
        quantity: item.quantity,
        deliveryStatus: item.deliveryId.deliveryStatus,
        Status: item.status,
      };
    };

    const sortedData = dataOrder.map(mapDataToHeader);

    console.log(mapDataToHeader);
    function handleDownloadExcel() {
      downloadExcel({
        fileName: "exportOrder-> downloadExcel method",
        sheet: "exportOrder",
        tablePayload: {
          header,
          // accept two different data structures
          body: sortedData,
        },
      });
    }
    handleDownloadExcel();
  };

  const handleMenuClick = (e) => {
    if (e.key === "1") {
      exelUser();
    } else if (e.key === "2") {
      exportProducts();
    } else if (e.key === "3") {
      exportOrder();
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Export Users</Menu.Item>
      <Menu.Item key="2">Export Products</Menu.Item>
      <Menu.Item key="3">Export Orders</Menu.Item>
    </Menu>
  );

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
      callApiUsers();
      callApiQuotes();
      callApiOrders();
      callApiProducts();
      callApiPromotions();
    }
  }, [token]);

  const callApiUsers = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/admin/get-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch(
          "http://localhost:8080/api/v1/admin/get-users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataUser(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataUser(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiOrders = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/get-all-order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch("http://localhost:8080/api/v1/get-all-order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${newToken}`,
          },
        });
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataOrder(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataOrder(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiPromotions = async () => {
    try {
      const req1 = await fetch(
        "http://localhost:8080/api/v1/promotion/get-promotion",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch(
          "http://localhost:8080/api/v1/promotion/get-promotion",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
          }
        );
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataPromotion(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataPromotion(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiQuotes = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/support", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (req1.status == 403) {
        const newToken = await callRefreshToken(token);
        if (!newToken) throw new Error("Please log in again!");
        setCookie("token", newToken, 7);
        setToken(newToken);
        const req2 = await fetch("http://localhost:8080/api/v1/support", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${newToken}`,
          },
        });
        if (req2.status === 200) {
          const res2 = await req2.json();
          setDataSupport(res2.data);
        }
      }
      if (req1.status === 200) {
        const res2 = await req1.json();
        setDataSupport(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const callApiProducts = async () => {
    try {
      const req1 = await fetch("http://localhost:8080/api/v1/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // authorization: `Bearer ${token}`,
        },
      });
      if (req1.status === 201) {
        const res2 = await req1.json();
        setDataProduct(res2.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100">
      <div className="w-full flex items-center justify-between pb-3">
        {dataSideBar.map(
          (item, index) =>
            currentPath === `/admin/${item.name.toLowerCase()}` && (
              <div
                key={index}
                className="text-gray-500"
              >{`Admin > ${item.name}`}</div>
            )
        )}
        {currentPath === `/admin/products/addproduct` && (
          <div className="text-gray-500">
            Admin {">"} Products {">"} Add Product
          </div>
        )}
        {currentPath === `/admin/promotion/addpromotion` && (
          <div className="text-gray-500">
            Admin {">"} Promotion {">"} Add Promotion
          </div>
        )}
        {currentPath === `/admin/customres/addcustomers` && (
          <div className="text-gray-500">
            Admin {">"} Customres {">"} Add Customres
          </div>
        )}

        <div className="flex items-center space-x-4">
          <span className="font-bold italic">
            {user?.username || ""} / {user?.role || ""}
          </span>
          <img src={icon} alt="" className="cursor-pointer" onClick={logOut} />
        </div>
      </div>

      <div className="w-full bg-gray-100 flex items-center justify-between">
        {dataSideBar.map(
          (item, index) =>
            currentPath === `/admin/${item.name.toLowerCase()}` && (
              <div key={index} className="text-3xl font-bold">
                {item.name}
              </div>
            )
        )}
        {currentPath === `/admin/products/addproduct` && (
          <div className="text-3xl font-bold">Add Product</div>
        )}
        {currentPath === `/admin/promotion/addpromotion` && (
          <div className="text-3xl font-bold">Add Promotion</div>
        )}
        {currentPath === `/admin/customres/addcustomers` && (
          <div className="text-3xl font-bold">Add Customres</div>
        )}

        <div className="flex gap-8">
          {currentPath === "/admin/products" && (
            <button
              className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700"
              onClick={addProduct}
            >
              ADD PRODUCT
            </button>
          )}
          {currentPath === "/admin/promotion" && (
            <button
              className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700"
              onClick={addPromotion}
            >
              ADD PROMOTION
            </button>
          )}
          {currentPath === "/admin/customers" && (
            <button
              className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700"
              onClick={addCustomers}
            >
              ADD CUSTOMERS
            </button>
          )}

          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700 h-10">
              EXPORT EXCEL <DownOutlined />
            </Button>
          </Dropdown>
          <button
            className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700"
            // onClick={addCustomers}
          >
            REFRESH
          </button>
          <button
            className="bg-gray-800 p-2 rounded-md text-white hover:bg-gray-700"
            onClick={() => navigate("/")}
          >
            HOME
          </button>
          <input
            type="text"
            className="rounded-md p-2 hidden sm:block"
            placeholder="Search"
            onChange={searchInput}
            value={search}
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const HeaderUI = () => {
  return (
    <AdminProvider>
      <Header />
    </AdminProvider>
  );
};
export default HeaderUI;
