import { axiosInstance } from "../axios/axiosInstance"



export const createReservation = (data) =>{
    return axiosInstance.post('/reservation/createReservation', data)
}

export const getReservations = () =>{
    return axiosInstance.get('/reservation/getReservations')
}

export const updateReservation = (reservationId,updatedData) =>{
    return axiosInstance.put(`/reservation/updateReservation/${reservationId}`, updatedData)
}

export const deleteReservation = (reservationId) =>{
    return axiosInstance.delete(`/reservation/removeReservation/${reservationId}`)
}