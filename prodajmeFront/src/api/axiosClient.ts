import axios from 'axios'

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prodajme_jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('prodajme_current_user')
      localStorage.removeItem('prodajme_jwt_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosClient
