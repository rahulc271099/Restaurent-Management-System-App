import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import LoginPage from "../pages/shared/LoginPage";
import RegisterPage from "../pages/customer/RegisterPage";
import MenuItemPage from "../pages/customer/MenuItemPage";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import ReservationPage from "../pages/customer/ReservationPage";
import AdminMenuPage from "../pages/admin/AdminMenuPage";
import ManageTable from "../pages/admin/ManageTable";
import ManageStaff from "../pages/admin/ManageStaff";
import ManageMenuItems from "../pages/admin/ManageMenuItems";
import ManageOrders from "../pages/admin/ManageOrders";
import ManageReservations from "../pages/admin/ManageReservation";
import CartPage from "../pages/customer/CartPage";
import OrderPage from "../pages/customer/OrderPage";
import ReservationManagement from "../pages/customer/ReservationManagement";
import OrderManagement from "../pages/customer/OrderManagement";
import ReportDashboard from "../pages/admin/ReportDashboard";
import OrderConfirmation from "../pages/customer/OrderConfirmation";
import AboutPage from "../pages/customer/AboutPage";
import GalleryPage from "../pages/customer/GalleryPage";
import ContactPage from "../pages/customer/ContactPage";
import StaffDashboard from "../pages/staff/StaffDashBoard";
import TableSelectionPage from "../pages/staff/TableSelection";
import StaffLayout from "../layout/StaffLayout";
import StaffOrderManagement from "../pages/staff/StaffOrderManagement";
import SalesReportDashboard from "../pages/admin/SalesReportDashBoard";
import BillingPage from "../pages/admin/BillingPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    // path: "/customer",
    // element: <CustomerLayout />,
    path: "/customer",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "menu",
        element: <MenuItemPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "reservation",
        element: <ReservationPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "reservationManagement",
        element: <ReservationManagement />,
      },
      {
        path: "orderManagement",
        element: <OrderManagement />,
      },
    ],
  },
  {
    path: "/customer/orderConfirmation",
    element: <OrderConfirmation />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path: "menu",
        element: <AdminMenuPage />,
        children: [
          { path: "manageTables", element: <ManageTable /> },
          { path: "manageStaffs", element: <ManageStaff /> },
          { path: "manageMenuItems", element: <ManageMenuItems /> },
          { path: "manageOrders", element: <ManageOrders /> },
          { path: "manageReservations", element: <ManageReservations /> },
          { path: "reports", element: <ReportDashboard /> },
          { path: "salesReportDashBoard", element: <SalesReportDashboard /> },
        ],
      },
      {
        path:"billingPage",
        element: <BillingPage/>,
      }
    ],
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={["staff"]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <StaffDashboard />,
      },
      {
        path: "tableSelection",
        element: <TableSelectionPage />,
      },
      {
        path: "orders",
        element: <StaffOrderManagement />,
      },
    ],
  },
]);
