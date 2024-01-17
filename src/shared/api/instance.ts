import axios from "axios"

export const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1",
    withCredentials: true,
    headers: {
        "API-KEY": "b00ccd4a-cf77-4c91-bdbe-aa7fb7f8fcd9",
    },
})
