import axios from "axios"

export const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1",
    withCredentials: true,
    headers: {
        "API-KEY": "901196af-03b1-43ed-ba81-7c0d3e213179",
    },
})
