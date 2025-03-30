import { axiosInstance } from "../axios/axiosInstance"



export const getOrders = () =>{
    return axiosInstance.get('/order/getOrders')
}

export const getLatestOrder = () =>{
    return axiosInstance.get('/order/getLatestOrder')
}

export const createOrder = (orderData) =>{
    return axiosInstance.post('/order/createOrder', orderData)
}

export const updateOrder = (updatedData,orderId) =>{
    return axiosInstance.put(`/order/updateOrder/${orderId}`, updatedData)
}

export const updateOrderItems = (orderItems,orderId) =>{
    return axiosInstance.put(`/order/updateOrderItems/${orderId}`, orderItems)
}

export const deleteOrderItem = (orderId,orderItemId) =>{
    return axiosInstance.delete(`/order/removeOrderItem/${orderId}/${orderItemId}`)
}

export const deleteOrder = (orderId) =>{
    return axiosInstance.delete(`/order/removeOrder/${orderId}`)
}