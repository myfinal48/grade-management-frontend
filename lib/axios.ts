import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios"
import { getSession } from "next-auth/react"

export const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8888/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession()
      if (session?.accessToken) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
      return config
    } catch (error) {
      // Always reject with Error object
      return Promise.reject(error instanceof Error ? error : new Error("Request interceptor error"))
    }
  },
  (error: AxiosError) => {
    // Always reject with Error object
    return Promise.reject(error instanceof Error ? error : new Error("Request error"))
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status
      const url = error.config?.url || ""

      // List of optional endpoints that might not be available
      const knownOptionalEndpoints = ["/pdf-transcript/requests", "/students", "/semesters"]

      const isOptionalEndpoint = knownOptionalEndpoints.some((endpoint) => url.includes(endpoint))

      if (status === 401) {
        // Create proper error before redirecting
        const err = new Error("Session expired")
        err.name = "SessionExpiredError"
        window.location.href = `/login?error=session_expired`
        return Promise.reject(err)
      } else if (status === 403) {
        // Don't redirect for optional endpoints, just log silently
        if (isOptionalEndpoint) {
          // Return a silent error for optional endpoints
          const err = new Error("Access forbidden to optional endpoint")
          err.name = "OptionalEndpointForbiddenError"
          return Promise.reject(err)
        } else {
          const err = new Error("Unauthorized access")
          err.name = "UnauthorizedError"
          console.warn(
            "Access forbidden:",
            error.response?.data?.message || "Vous n'avez pas la permission d'accéder à cette ressource",
          )
          return Promise.reject(err)
        }
      } else if (status === 404) {
        // Don't log 404 for optional endpoints
        if (!isOptionalEndpoint) {
          console.error("Resource not found:", url)
        }
        const err = new Error("Resource not found")
        err.name = "NotFoundError"
        return Promise.reject(err)
      } else if (status === 500) {
        const err = new Error("Server error")
        err.name = "ServerError"
        console.error("Server Error:", error)
        return Promise.reject(err)
      }

      if (!error.response) {
        const err = new Error("Network error")
        err.name = "NetworkError"
        console.error("Network Error:", error.message)
        return Promise.reject(err)
      }
    }

    // Ensure we always reject with an Error instance
    return Promise.reject(error instanceof Error ? error : new Error("Unknown error"))
  },
)
