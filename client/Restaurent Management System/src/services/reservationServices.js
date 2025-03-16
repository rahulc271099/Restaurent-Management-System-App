import { axiosInstance } from "../axios/axiosInstance"



export const createReservation = (data) =>{
    return axiosInstance.post('/reservation/createReservation', data)
}

export const getReservation = () =>{
    return axiosInstance.get('/reservation/getReservations')
}

export const updateReservation = () =>{
    return axiosInstance.put('/reservation/updateReservation')
}

export const deleteReservation = () =>{
    return axiosInstance.delete('/reservation/deleteReservation')
}