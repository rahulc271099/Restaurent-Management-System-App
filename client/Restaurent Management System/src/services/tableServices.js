import { axiosInstance } from "../axios/axiosInstance"



export const getTables = () =>{
    return axiosInstance.get('/table/getTables')
}

export const updateTable = (tableId,updateData) =>{
    return axiosInstance.put(`/table/updateTable/${tableId}`, updateData)
}