import { axiosInstance } from "../axios/axiosInstance"



export const register = (data) =>{
    return axiosInstance.post('/customerRegister', data)
}