import { axiosInstance } from "../axios/axiosInstance"



export const getMenuItems = (filters) =>{
    return axiosInstance.get('/menuItem/getMenuItems', {params:filters})
}

export const getChefSpecial = () =>{
    return axiosInstance.get('/menuItem/chefSpecial')
}

export const addMenuItems = (menuData) =>{
    return axiosInstance.post('/menuItem/createMenuItem', menuData)
}

export const updateChefSpecial = (menuItemIds) =>{
    return axiosInstance.put('/menuItem/updateChefSpecial', menuItemIds)
}

export const updateMenuItem = (updatedData,menuItemId) =>{
    return axiosInstance.put(`/menuItem/updateMenuItem/${menuItemId}`, updatedData)
}

export const deleteMenuItem = (menuItemId) =>{
    return axiosInstance.delete(`/menuItem/deleteMenuItem/${menuItemId}`)
}