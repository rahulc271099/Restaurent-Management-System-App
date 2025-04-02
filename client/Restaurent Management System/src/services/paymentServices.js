import { axiosInstance } from "../axios/axiosInstance"


export const createPaymentIntent = (paymentData) =>{
    return axiosInstance.post('/payment/createPaymentIntent', paymentData)
}

export const confirmPayment = (paymentData) =>{
    return axiosInstance.post('/payment/confirmPayment', paymentData)
}

export const updatePaymentStatus = (paymentData) =>{
    return axiosInstance.put('payment/updatePaymentStatus', paymentData)
}