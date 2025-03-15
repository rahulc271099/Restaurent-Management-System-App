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
    path: "/customer",
    element: <CustomerLayout/>,
    // (
    //   <ProtectedRoute allowedRoles={['customer']}>
    //     <CustomerLayout />
    //   </ProtectedRoute>
    // ),
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
        path:"reservation",
        element: <ReservationPage/>,
      },
      {
        path:"cart",
        element: <CartPage/>,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin", "staff"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },
      {
        path:"menu",
        element: <AdminMenuPage/>,
        children: [
          { path: "manageTables", element: <ManageTable /> },
          { path: "manageStaffs", element: <ManageStaff /> },
          {path: "manageMenuItems", element: <ManageMenuItems/> },
          {path: "manageOrders",element: <ManageOrders/>},
          {path: "manageReservations",element: <ManageReservations/>}
        ],
      },
    ],
  },
]);
