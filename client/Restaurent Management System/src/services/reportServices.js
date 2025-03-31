import { axiosInstance } from "../axios/axiosInstance"



export const getReport = () =>{
    return axiosInstance.get('/report/getReport')
}