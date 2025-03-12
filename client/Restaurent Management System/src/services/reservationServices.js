import { axiosInstance } from "../axios/axiosInstance"



export const createReservation = (data) =>{
    return axiosInstance.post('/reservation/createReservation', data)
}