import { axiosInstance } from "../axios/axiosInstance"




export const userLogin = (data) =>{
    return axiosInstance.post('/auth/login', data)
} 
