import { axiosInstance } from "../axios/axiosInstance"



export const addToCart = (data) =>{
    return axiosInstance.post('/cart/createCart', data)
}

export const getCart = () =>{
    return axiosInstance.get('/cart/getCart')
}

export const updateCart = (data) =>{
    return axiosInstance.put('/cart/updateCart', data)
}

export const deleteCart = (menuItemId) =>{
    return axiosInstance.delete('/cart/removeCart', {
        params: { menuItemId }
      })
}

export const clearCart = () =>{
    return axiosInstance.delete('/cart/clearCart')
}