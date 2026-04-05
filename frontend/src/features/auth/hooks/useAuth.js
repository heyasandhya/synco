import { useContext,useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";



export const useAuth = () => {

	const context = useContext(AuthContext)
	const { user, setUser, loading, setLoading } = context


	const handleLogin = async ({ email, password }) => {
		setLoading(true)
		try {
			const data = await login({ email, password })
			setUser(data.user)
		} catch (err) {

			console.log("LOGIN ERROR ", err.response?.data)

		} finally {
			setLoading(false)
		}
	}

	const handleRegister = async ({ username, email, password }) => {
		setLoading(true)
		try {
			const data = await register({ username, email, password })
			setUser(data.user)

		}
		catch (err) {
			console.log("REGISTER ERROR ", err.response?.data)
		}
		finally {
			setLoading(false)
		}
	}

	const handleLogout = async () => {
		setLoading(true)
		try {
			const data = await logout()
			setUser(null)

		} catch (error) {

		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
	const getAndSetUser = async () => {
		try {
			const data = await getMe()
			if (data?.user) {
				setUser(data.user)
			} else {
				setUser(null) // ✅ handle 401 case
			}
		} catch (err) {
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	getAndSetUser()
}, [])


	return { user, loading, handleRegister, handleLogin, handleLogout }
}