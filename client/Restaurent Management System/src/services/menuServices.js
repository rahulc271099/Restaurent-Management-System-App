import { axiosInstance } from "../axios/axiosInstance"



export const getMenuItems = (filters) =>{
    return axiosInstance.get('/menuItem/getMenuItems', {params:filters})
}