import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { getAccessToken, invalidateToken } from './auth'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken()
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      invalidateToken()

      try {
        const token = await getAccessToken()
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
