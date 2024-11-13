import axios from 'axios';

const axiosInstance = axios.create({
    headers:{
        Authorization: `Bearer ${import.meta.env.VITE_MOVIE_API_URL}`
    },
    baseURL: import.meta.env.VITE_MOVIE_API_URL
})

export {axiosInstance}

// api를 불러올 때 항상 사용하는 코드를 따로 파일로 만들어서 중복된 코드를 방지한다