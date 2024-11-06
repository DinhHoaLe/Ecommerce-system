import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Avatar,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import "./ProfilePageBody.css";
import { AdminProvider } from "../../../Admin-UI/AdminContext";
import citiesInVietnam from "./listCity"; // Danh sách thành phố, quận/huyện
import validator from "validator";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

function ProfilePageBody({ userData, refreshToken, callApi }) {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [idCard, setIdCard] = useState("");
  const [newImage, setNewImage] = useState(userData.avatar);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedWard, seclectedWard] = useState("");
  const [selectedDistrict, seclectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [number, setNumber] = useState([]);
  const [zipcode, setZipcode] = useState([]);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!userData || !userData._id) {
      return;
    }
    form.setFieldsValue({
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender !== undefined ? userData.gender : null,
      dateOfBirth: userData.dateOfBirth ? moment(userData.dateOfBirth) : null,
      idCard: userData.idCard,
      number: userData.address.number,
      ward: userData.address.ward,
      district: userData.address.district,
      city: userData.address.city,
      zipcode: userData.zipcode,
      avatar: userData.avatar,
    });
    setAvatar(userData.avatar);
    setFirstName(userData.firstName);
    setLastName(userData.lastName);
    setGender(userData.gender);
    setDateOfBirth(userData.dateOfBirth);
    setIdCard(userData.idCard);
    // setSelectedCity(userData.address.city);
  }, [userData, form]);

  const formData = new FormData();
  formData.append("userId", userData._id);
  formData.append("file", newImage);
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("gender", gender);
  formData.append("dateOfBirth", dateOfBirth);
  formData.append("idCard", idCard);
  formData.append("number", number);
  formData.append("ward", selectedWard);
  formData.append("district", selectedDistrict);
  formData.append("city", selectedCity);
  formData.append("zipcode", zipcode);
  formData.append("password", password);

  console.log(newImage);
  const getCookieValue = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const getToken = getCookieValue("token");
    if (getToken) {
      setToken(getToken);
    }
  }, [token]);

  const onFinish = async (values) => {
    try {
      const req1 = await fetch(
        "http://localhost:8080/api/v1/users/update-profile",
        {
          method: "PATCH",
          headers: {
            // "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (req1.status === 403) {
        const newToken = await refreshToken(token);
        if (!newToken) throw new Error("Please log in first!");
        setToken(newToken);
        const req2 = await fetch(
          "http://localhost:8080/api/v1/users/update-profile",
          {
            method: "PATCH",
            headers: {
              // "Content-Type": "application/json",
              authorization: `Bearer ${newToken}`,
            },
            body: formData,
          }
        );
        const res2 = await req2.json();
        if (req2.status === 200) {
          toast.success(res2.message, {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setPassword("");
          callApi();
          form.resetFields(["currentPassword"]);
        } else {
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
          return;
        }
      }
      if (req1.status === 200) {
        toast.success(req1.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setPassword("");
        callApi();
        form.resetFields(["currentPassword"]);
      }
    } catch (error) {
      console.log("error", error);
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

  const handleImageChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
    };
    setNewImage(file);
    reader.readAsDataURL(file);
    return false;
  };

  // const isValidPhone = validator.isMobilePhone(phone, "vi-VN");

  const handleCityChange = (value) => {
    setSelectedCity(value);
    const selectedCityObj = citiesInVietnam.find(
      (city) => city.value === value
    );
    setDistricts(selectedCityObj ? selectedCityObj.districts : []);
    form.setFieldsValue({ district: undefined, ward: undefined });
    setWards([]);
  };

  const handleDistrictChange = (value) => {
    seclectedDistrict(value);
    const selectedDistrict = districts.find(
      (district) => district.value === value
    );
    setWards(selectedDistrict ? selectedDistrict.wards : []);
    form.setFieldsValue({ ward: undefined });
  };

  const handleDOB = (value) => {
    const currentDate = new Date();
    const DOB = new Date(value);
    if (DOB > currentDate) {
      toast.warn("DOB is incorrect!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    } else {
      setDateOfBirth(DOB);
    }
  };

  return (
    <div
      style={{
        width: "75%",
        marginLeft: "20px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {userData ? (
        <div>
          <Typography.Title
            level={2}
            style={{
              color: "#007BFF",
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            My Profile
          </Typography.Title>

          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ marginTop: "20px" }}
          >
            {/* Avatar */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar size={100} src={avatar} />
              <Upload
                name="avatar"
                showUploadList={false}
                style={{ marginTop: "15px" }}
                beforeUpload={handleImageChange}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{ color: "#007BFF", marginTop: "15px" }}
                >
                  Upload New Avatar
                </Button>
              </Upload>
            </div>

            {/* First Name and Last Name */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: "First Name is required" },
                  { whitespace: true, message: "First Name cannot be empty" },
                ]}
                style={{ width: "48%" }}
              >
                <Input
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: "Last Name is required" },
                  { whitespace: true, message: "Last Name cannot be empty" },
                ]}
                style={{ width: "48%" }}
              >
                <Input
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Item>
            </div>

            {/* Gender and Birthdate*/}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Gender is required" }]}
                style={{ width: "48%" }}
              >
                <Select
                  placeholder="Gender"
                  value={gender !== undefined ? gender : null}
                  onChange={(value) => setGender(value)}
                >
                  <Option value={true}>Man</Option>
                  <Option value={false}>Woman</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Birthdate"
                rules={[{ required: true, message: "Birthdate is required" }]}
                style={{ width: "48%" }}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={(date, dateString) => handleDOB(dateString)}
                />
              </Form.Item>
            </div>

            {/* Id Card and zipcode*/}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="idCard"
                label="ID Card"
                rules={[{ required: true, message: "ID Card is required" }]}
                style={{ width: "48%" }}
              >
                <Input
                  placeholder="ID Card"
                  type="number"
                  onChange={(e) => setIdCard(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="zipcode"
                label="Zipcode"
                // rules={[{ required: true, message: "District is required" }]}
                style={{ width: "48%" }}
              >
                <Input
                  placeholder="Zipcode"
                  type="number"
                  onChange={(e) => setZipcode(e.target.value)}
                />
              </Form.Item>
            </div>

            {/* City and District */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="city"
                label="City"
                // rules={[{ required: true, message: "City is required" }]}
                style={{ width: "48%" }}
              >
                <Select placeholder="Select City" onChange={handleCityChange}>
                  {citiesInVietnam.map((item, index) => (
                    <Option key={index} value={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="district"
                label="District"
                // rules={[{ required: true, message: "District is required" }]}
                style={{ width: "48%" }}
              >
                <Select
                  placeholder="Select District"
                  onChange={handleDistrictChange}
                  disabled={!selectedCity}
                >
                  {districts.map((district, index) => (
                    <Option key={index} value={district.value}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Ward and number*/}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Form.Item
                name="ward"
                label="Ward"
                // rules={[{ required: true, message: "Ward is required" }]}
                style={{ width: "48%" }}
              >
                <Select
                  placeholder="Select Ward"
                  disabled={wards.length === 0}
                  onChange={(value) => seclectedWard(value)}
                >
                  {wards.map((ward, index) => (
                    <Option key={index} value={ward.value}>
                      {ward.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="number"
                label="Number and Street"
                // rules={[{ required: true, message: "Number and Street is required" }]}
                style={{ width: "48%" }}
              >
                <Input
                  placeholder="Number and Street"
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Form.Item>
            </div>

            {/* Password */}
            <Form.Item
              name="currentPassword"
              label="Password"
              rules={[
                { required: true, message: "Current password is required" },
              ]}
            >
              <Input.Password
                placeholder="Current Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            {/* Save and Cancel Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  borderRadius: "4px",
                }}
              >
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div>Loading</div>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
}

export default ProfilePageBody;
