import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

axios.defaults.withCredentials = true

let isRefreshing = false
let failedQueue = []

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/admin/auth/refresh') ||
          originalRequest.url?.includes('/admin/auth/login') ||
          originalRequest.url?.includes('/admin/auth/logout')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => axios(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/admin/auth/refresh`
          : 'http://localhost:8081/api/admin/auth/refresh')
        failedQueue.forEach(({ resolve }) => resolve())
        failedQueue = []
        return axios(originalRequest)
      } catch {
        failedQueue.forEach(({ reject }) => reject(error))
        failedQueue = []
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login'
        }
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
