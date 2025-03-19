import { axiosInstance } from "../axios/axiosInstance"



export const getOrders = () =>{
    return axiosInstance.get('/order/getOrders')
}

export const createOrder = (data) =>{
    return axiosInstance.post('/order/createOrder', data)
}

export const updateOrder = (updatedData,orderId) =>{
    return axiosInstance.put(`/order/updateOrder/${orderId}`, updatedData)
}

export const deleteOrderItem = (orderId,orderItemId) =>{
    return axiosInstance.delete(`/order/removeOrderItem/${orderId}/${orderItemId}`)
}

export const deleteOrder = (orderId) =>{
    return axiosInstance.delete(`/order/removeOrder/${orderId}`)
}