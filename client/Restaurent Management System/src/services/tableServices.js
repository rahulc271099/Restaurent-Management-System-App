import { axiosInstance } from "../axios/axiosInstance"


export const createTable = (tableData) =>{
    return axiosInstance.post('/table/createTable', tableData)
}

export const getTables = () =>{
    return axiosInstance.get('/table/getTables')
}

export const updateTable = (updateData,tableId) =>{
    return axiosInstance.put(`/table/updateTable/${tableId}`, updateData)
}

export const deleteTable = (tableId) =>{
    return axiosInstance.delete(`/table/removeTable/${tableId}`)
}