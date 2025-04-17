import axios from "axios"
import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://trialveridose.onrender.com"

// Create a function to get CSRF token
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
})

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
  (config) => {
    // Add CSRF token for non-GET requests
    if (config.method !== "get") {
      config.headers["X-CSRF-Token"] = getCsrfToken()
    }
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor with improved error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Default error message
    let message = "An unexpected error occurred"

    // Handle different error scenarios
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        message = "Your session has expired. Please log in again."
        // Redirect to login page
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          window.location.href = "/auth/login"
        }
      } else if (error.response.status === 403) {
        message = "You don't have permission to perform this action"
      } else if (error.response.status === 429) {
        message = "Too many requests. Please try again later."
      } else if (error.response.data?.message) {
        // Use server-provided message if available
        message = error.response.data.message
      }
    } else if (error.request) {
      // Request was made but no response received
      message = "No response from server. Please check your connection."
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })

    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    const response = await api.post("/api/auth/login", { email, password, role })
    return response.data
  },

  register: async (name: string, email: string, password: string, role: string, organization: string) => { // Add organization parameter
    const response = await api.post("/api/auth/register", { name, email, password, role, organization }) // Include organization in request body
    return response.data
  },
}

// Trials API
export const trialsAPI = {
  getAllTrials: async () => {
    const response = await api.get("/api/trials")
    return response.data
  },

  createTrial: async (trialData: any) => {
    const response = await api.post("/api/trials", trialData)
    return response.data
  },

  joinTrial: async (trialId: string) => {
    const response = await api.put(`/api/trials/${trialId}/join`)
    return response.data
  },

  respondToJoinRequest: async (trialId: string, hospitalId: string, status: "accepted" | "rejected") => {
    const response = await api.put(`/api/trials/${trialId}/respond`, { hospitalId, status })
    return response.data
  },
}

// Reports API
export const reportsAPI = {
  submitReport: async (reportData: any) => {
    const response = await api.post("/api/reports/submit", reportData)
    return response.data
  },

  getTrialReports: async (trialId: string) => {
    const response = await api.get(`/api/reports/trial/${trialId}`)
    return response.data
  },

  finalizeReports: async (trialId: string) => {
    const response = await api.post(`/api/reports/finalize/${trialId}`)
    return response.data
  },

  getFinalReports: async (trialId: string) => {
    const response = await api.get(`/api/reports/final/${trialId}`)
    return response.data
  },
}

// AI API
export const aiAPI = {
  predictTrialAnomaly: async (trialId: string) => {
    const response = await api.post(`/api/ai/predict-anomaly/${trialId}`);
    return response.data; // Assuming backend returns { success: true, data: predictions }
  },
}

export default api
