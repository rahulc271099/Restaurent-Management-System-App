import { axiosInstance } from "../axios/axiosInstance"



export const getMenuItems = (filters) =>{
    return axiosInstance.get('/menuItem/getMenuItems', {params:filters})
}

export const getChefSpecial = () =>{
    return axiosInstance.get('/menu/chefSpecial')
}

export const addMenuItems = (menuData) =>{
    return axiosInstance.post('/menuItem/createMenuItem', menuData)
}

export const updateChefSpecial = (updatedMenuIds) =>{
    return axiosInstance.put('/menu/update-chef-special', updatedMenuIds)
}

export const updateMenuItem = (updatedData,menuItemId) =>{
    return axiosInstance.put(`/menuItem/updateMenuItem/${menuItemId}`, updatedData)
}

export const deleteMenuItem = (menuItemId) =>{
    return axiosInstance.delete(`/menuItem/deleteMenuItem/${menuItemId}`)
}