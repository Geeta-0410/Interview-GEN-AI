import axios from "axios"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data

    } catch (err) {
        const errorMsg = err.response?.data?.message || err.message
        console.error("Register error:", errorMsg)
        throw new Error(errorMsg)
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        const errorMsg = err.response?.data?.message || err.message
        console.error("Login error:", errorMsg)
        throw new Error(errorMsg)
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {
        console.error("Logout error:", err.response?.data || err.message)
        throw err
    }
}

export async function getMe() {

    try {
        // Use fetch instead of axios to avoid network error logging for 401s
        const response = await fetch("http://localhost:3000/api/auth/get-me", {
            credentials: 'include'
        })

        if (response.status === 401) {
            throw new Error("Unauthorized")
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()

    } catch (err) {
        if (err.message !== "Unauthorized") {
            console.error("GetMe error:", err.message)
        }
        throw err
    }

}