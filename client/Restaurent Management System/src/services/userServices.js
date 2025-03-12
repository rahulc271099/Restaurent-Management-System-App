import { axiosInstance } from "../axios/axiosInstance"




export const userLogin = (data) =>{
    return axiosInstance.post('/auth/login', data)
} 

export const verifyUser = () =>{
    return axiosInstance.get('/auth/verify')
}

export const userLogout = () =>{
    return axiosInstance.post('/logout')
}
