import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data && data.user) {
                setUser(data.user)
            } else {
                alert("Login failed: Invalid response from server")
            }
        } catch (err) {
            console.error("Login failed:", err)
            alert(err.message || "Login failed. Please check your credentials.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data && data.user) {
                setUser(data.user)
            } else {
                alert("Registration failed: Invalid response from server")
            }
        } catch (err) {
            console.error("Registration failed:", err)
            alert(err.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {
            console.error("Logout failed:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                // Temporarily suppress console errors to hide 401 network error (expected when not authenticated)
                const originalError = console.error
                const originalWarn = console.warn
                console.error = () => {}
                console.warn = () => {}
                
                const data = await getMe()
                
                console.error = originalError
                console.warn = originalWarn
                
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch (err) {
                // User not authenticated on load, this is expected
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}