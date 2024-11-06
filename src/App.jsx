import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
// import SellerUI from "./assets/Seller-UI/SellerUI";
import CustomerUI from "./assets/Customer-UI/CustomerUI";
import AdminUI from "./assets/Admin-UI/AdminUI";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./assets/Admin-UI/components/dashBoard/dashBoard";
import Products from "./assets/Admin-UI/components/products/products";
import Orders from "./assets/Admin-UI/components/orders/orders";
import Customers from "./assets/Admin-UI/components/customers/customers";
import Promotion from "./assets/Admin-UI/components/promotion/promotion";
import Reviews from "./assets/Admin-UI/components/reviews/reviews";
import LogIn from "./assets/Admin-UI/components/logIn/logIn_admin";
import SignUp from "./assets/Admin-UI/components/signUp/signUp_admin";
import Test from "./assets/Admin-UI/test";
import AddProduct from "./assets/Admin-UI/components/addProduct/addProduct";
import Setting from "./assets/Admin-UI/components/setting/setting";
import Quotes from "./assets/Admin-UI/components/quotes/quotes";
import Rating from "./assets/Admin-UI/components/rating/rating";
import AddPromotion from "./assets/Admin-UI/components/addPromotion/addPromotion";
import BackUp from "./assets/Admin-UI/components/backUp/backUp";
import Help from "./assets/Admin-UI/components/help/help";
import Analytics from "./assets/Admin-UI/components/analytics/analytics";
import AddCustomers from "./assets/Admin-UI/components/addCustomers/addCustomers";
import ForgotPassword from "./assets/Admin-UI/components/forgotPassword/forgotPassword";
import ProfilePage from "./assets/Customer-UI/pages/ProfilePage";
import HomePage from "./assets/Customer-UI/pages/HomePage";
import ErrorPage from "./assets/Customer-UI/pages/ErrorPage";
import ResetPassword from "./assets/Admin-UI/components/resetPassword/resetPassword";
import VerificationEmail from "./assets/Admin-UI/components/verificationEmail/verificationEmail";
import ProfilePageBody from "./assets/Customer-UI/components/edit-page/ProfilePageBody";
import Authorization from "./assets/Customer-UI/components/edit-page/Authorization";
import ChangePassword from "./assets/Customer-UI/components/edit-page/ChangePassword";
import MyOrder from "./assets/Customer-UI/components/edit-page/MyOrder";
import MyPayment from "./assets/Customer-UI/components/edit-page/PaymentMethod";
import Admin from "./assets/Admin-UI/components/admin/admin";
import MyQuotes from "./assets/Customer-UI/components/edit-page/MyQuotes";
import ContactUs from "./assets/Customer-UI/components/edit-page/ContactUs";
import MyPurchaseHistory from "./assets/Customer-UI/components/edit-page/MyPurchaseHistory";
import MyWishList from "./assets/Customer-UI/components/edit-page/MyWishList";
import MySetting from "./assets/Customer-UI/components/edit-page/MySetting";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState("admin");

  const adminRouter = createBrowserRouter([
    {
      path: "/admin",
      element: <AdminUI />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        {
          path: "products",
          element: <Products />,
          children: [{ path: "addproduct", element: <AddProduct /> }],
        },
        { path: "orders", element: <Orders /> },
        {
          path: "customers",
          element: <Customers />,
          children: [{ path: "addcustomers", element: <AddCustomers /> }],
        },
        {
          path: "admin",
          element: <Admin />,
          children: [{ path: "addAdmin", element: <AddCustomers /> }],
        },
        { path: "rating", element: <Rating /> },
        {
          path: "promotion",
          element: <Promotion />,
          children: [{ path: "addpromotion", element: <AddPromotion /> }],
        },
        { path: "reviews", element: <Reviews /> },
        { path: "quotes", element: <Quotes /> },
        { path: "setting", element: <Setting /> },
        { path: "backup", element: <BackUp /> },
        { path: "help", element: <Help /> },
        { path: "analytics", element: <Analytics /> },
      ],
    },
    {
      path: "/login",
      element: <LogIn />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/profile",
      element: <ProfilePage />,
      children: [
        { path: "my-profile", element: <ProfilePageBody /> },
        { path: "my-authorization", element: <Authorization /> },
        { path: "my-password", element: <ChangePassword /> },
        { path: "my-order", element: <MyOrder /> },
        { path: "my-payment", element: <MyPayment /> },
        { path: "contact-us", element: <ContactUs /> },
        { path: "my-quotes", element: <MyQuotes /> },
        { path: "my-purchase-history", element: <MyPurchaseHistory /> },
        { path: "my-wishList", element: <MyWishList /> },
        { path: "my-setting", element: <MySetting /> },
      ],
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/verification-email",
      element: <VerificationEmail />,
    },
    {
      path: "/",
      element: <HomePage />,
      errorElement: <ErrorPage />,
      children: [],
    },
  ]);

  const customerRouter = createBrowserRouter([
    // {
    //   path: "/shopping-cart",
    //   element: <ShoppingCart />,
    // },
    {
      path: "/edit-page",
      element: <ProfilePage />,
    },
    // {
    //   path: "/productlist",
    //   element: <ProductList />,
    // },
    // {
    //   path: "/product/:id",
    //   element: <ProductDetails />,
    // },
    // {
    //   path: "/productwishlist",
    //   element: <ProductWishlist />, // Define route for ProductWishlist
    // },
    // {
    //   path: "/contactpage",
    //   element: <ContactPage />,
    // },
    // {
    //   path: "/aboutpage",
    //   element: <AboutPage />,
    // },
    // {
    //   path: "/billingpage",
    //   element: <BillingPage />,
    // },
  ]);

  // const sellerRouter = createBrowserRouter([
  //   {
  //     path: "/",
  //     element: <SellerUI />,
  //   },
  // ]);
  return (
    <>
      {user === "admin" && <RouterProvider router={adminRouter} />}
      {/* {user === "seller" && <RouterProvider router={sellerRouter} />} */}
      {user === "customer" && <RouterProvider router={customerRouter} />}
    </>
  );
}

export default App;
