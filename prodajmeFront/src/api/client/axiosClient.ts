import axios from 'axios'

// Zajednička Axios instanca za komunikaciju sa backendom
const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// OVO PRE svakog zahteva dodaje JWT token ukoliko korisnik ima aktivnu sesiju
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

    // Ako backend vrati 401, korisnik se automatski odjavljuje
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('prodajme_current_user')
      localStorage.removeItem('prodajme_jwt_token')

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosClient