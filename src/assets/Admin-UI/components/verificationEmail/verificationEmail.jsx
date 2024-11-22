import React, { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import Footer from "../../../Customer-UI/components/Footer";
import Navbar from "../../../Customer-UI/components/Navbar";
import img from "../img/signupandlogin.jpg";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function VerificationEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [apiCalled, setApiCalled] = useState(false);

  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

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
      return;
    }
  }, []);

  useEffect(() => {
    if (token && !apiCalled) {
      callApi();
      setApiCalled(true);
    }
  }, [token, apiCalled]);

  const callApi = async () => {
    try {
      const req = await fetch(
        "http://localhost:8080/api/v1/users/send-verification-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (req.status === 403) {
        const getNewToken = await refreshToken(token);
        setToken(getNewToken);
        try {
          const req2 = await fetch(
            "http://localhost:8080/api/v1/users/send-verification-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${getNewToken}`,
              },
            }
          );
        } catch (error) {
          console.log("Call refreshToken is failed!");
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const refreshToken = async (xxx) => {
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
      if (req.status === 200) {
        return res.accessToken;
      }
    } catch (error) {
      console.log("Call refreshToken is failed!");
    }
  };

  const handleOTP = async (e) => {
    e.preventDefault();
    console.log("check");
    try {
      let req1 = await fetch(
        "http://localhost:8080/api/v1/users/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            otp: otp,
          }),
        }
      );

      if (req1.status === 403) {
        const checkrefreshToken = await refreshToken(token);
        setToken(checkrefreshToken);
        if (checkrefreshToken) {
          setToken(checkrefreshToken);
          const req2 = await fetch(
            "http://localhost:8080/api/v1/users/verify-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${checkrefreshToken}`,
              },
              body: JSON.stringify({
                otp: otp,
              }),
            }
          );
          const res2 = await req2.json();
          if (req2.status === 200) {
            toast.success(res2.messege, {
              position: "top-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              onClose: () => {
                navigate("/profile");
              },
            });
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
      }

      if (req1.status === 200) {
        const res1 = await req1.json();
        toast.success(res1.message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            navigate("/");
          },
        });
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
        return;
      }
    } catch (error) {
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

  const resentApi = async () => {
    try {
      const getToken = getCookieValue("token");
      if (!getToken) {
        toast.warn("Login to sent OTP!", {
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
      callApi();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar />
      <div className="flex justify-center items-center gap-10">
        <img src={img} className="w-2/3" />
        <div className="w-1/3">
          <h2 className="text-2xl font-bold mb-4">Verification Email</h2>
          <form
            className="bg-white shadow-lg rounded-lg p-8 w-full"
            onSubmit={handleOTP}
          >
            <label htmlFor="text" className="block mb-1 font-medium">
              OTP:
            </label>
            <input
              type="text"
              id="text"
              className="block w-full p-2 border rounded-md mb-4"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              className="block w-full p-2 bg-red-500 text-white rounded-md mb-4"
            >
              Submit
            </button>
            <div className="flex justify-between">
              <button
                type="button"
                className="text-blue-500"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
              <button
                type="button"
                className="text-blue-500"
                onClick={() => navigate("/signup")}
              >
                Back to Sign Up
              </button>
            </div>

            <p className="mt-4 text-sm text-center">
              Please check your Email. Have you received the OTP?{" "}
              <button
                type="button"
                className="text-blue-500"
                onClick={resentApi}
              >
                Resent OTP
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
}

export default VerificationEmail;
