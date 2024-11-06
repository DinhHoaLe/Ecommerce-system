import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminProvider, useAdminContext } from "../../AdminContext";
import img from "../img/signupandlogin.jpg";
import { ToastContainer, toast } from "react-toastify";
import Footer from "../../../Customer-UI/components/Footer";
import Navbar from "../../../Customer-UI/components/Navbar";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

function LogIn() {
  // const { dataUserName } = useAdminContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  const loginGG = async (xxx) => {
    console.log(xxx);
    const req1 = await fetch("http://localhost:8080/api/v1/auth/login-by-gg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${xxx.credential}`,
      },
    });
    const res1 = await req1.json();
    const accessToken = res1.accessToken;
    setCookie("token", accessToken, 7);

    const decoded = jwtDecode(accessToken);

    if (req1.status === 400) {
      toast.warn("Log in failed!", {
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

    if (decoded.role === "admin") {
      toast.success("Login ADMIN successful!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => {
          navigate("/admin");
        },
      });
    }

    if (decoded.role === "user") {
      toast.success("Login successful!", {
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
    }
  };

  const logIn = async (e) => {
    e.preventDefault();
    try {
      const req = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (req.status !== 200) {
        const res = await req.json();
        toast.warn(res.message, {
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

      const res = await req.json();
      const accessToken = res.accessToken;

      setCookie("token", accessToken, 7);

      const decoded = jwtDecode(accessToken);

      if (decoded.isEmailVerified === false) {
        toast.warn("Your email has not been verified ", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            navigate("/verification-email");
          },
        });
        return;
      }

      if (decoded.role === "admin" || decoded.role === "super") {
        toast.success("Login ADMIN successful!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          onClose: () => {
            navigate("/admin");
          },
        });
      }

      if (decoded.role === "user") {
        toast.success("Login successful!", {
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
      }
    } catch (error) {
      console.error("Login failed:", error);
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

  const onSwitchToSignUp = () => {
    navigate("/signup");
  };

  useEffect(() => {
    const getToken = getCookieValue("token");
    if (getToken) {
      navigate("/profile");
    }
  }, []);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex items-center space-y-4 gap-10">
        <img src={img} className="w-2/3" />
        <div className="bg-white shadow-lg rounded-lg p-8 w-1/3">
          <form onSubmit={logIn} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Log in to Exclusive</h2>
              <div className="border-b-2 border-gray-300"></div>
            </div>
            <div>
              <label htmlFor="username" className="block mb-1 font-medium">
                Email:
              </label>
              <input
                type="text"
                id="username"
                className="block w-full p-2 border rounded-md mb-4"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password" className="block mb-1 font-medium">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="block w-full p-2 border rounded-md mb-4"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="showPassword"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword" className="text-sm font-medium">
                  Show Password
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="block w-full p-2 bg-red-500 text-white rounded-md"
              >
                Log In
              </button>
              {/* <button type="button" onClick={() => loginGG()}>
                Sign in with Google 🚀
              </button> */}
              <GoogleLogin
                onSuccess={(credentialResponse) => loginGG(credentialResponse)}
                onError={() => {
                  console.log("Login Failed");
                }}
                useOneTap
              />
              <button
                type="button"
                className="text-blue-500"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
            <p className="mt-4 text-sm text-center">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-500"
                onClick={onSwitchToSignUp}
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

const App = () => (
  <AdminProvider>
    <LogIn />
  </AdminProvider>
);

export default App;
