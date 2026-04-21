import axois from 'axios';

const axiosInstance = axois.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});

export default axiosInstance;