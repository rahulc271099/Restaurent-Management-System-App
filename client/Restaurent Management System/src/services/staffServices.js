import { axiosInstance } from "../axios/axiosInstance"



export const createStaff = (data) =>{
    return axiosInstance.post('/staff/createStaff', data)
}

export const getStaff = () =>{
    return axiosInstance.get('/staff/getStaff')
}

export const updateStaff = (data,staffId) =>{
    return axiosInstance.put(`/staff/updateStaff/${staffId}`, data)
}

export const deleteStaff = (staffId) =>{
    return axiosInstance.delete(`/staff/removeStaff/${staffId}`)
}