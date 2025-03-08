import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "../layout/CustomerLayout";
import HomePage from "../pages/customer/HomePage";
import LoginPage from "../pages/shared/LoginPage";
import RegisterPage from "../pages/customer/RegisterPage";
import MenuItemPage from "../pages/customer/MenuItemPage";


export const router = createBrowserRouter([
    {
        path:"/login",
        element: <LoginPage/>,
    },
    {
        path:"/",
        element: <LoginPage/>,
    },
    {
        path:"/register",
        element: <RegisterPage/>,
    },
    {
        path:"/customer",
        element: <CustomerLayout/>,
        children:[
            {
                path:"home",
                element:<HomePage/>,
            },
            {
                path:"menu",
                element: <MenuItemPage/>,
            },
        ]
    }
])