import axios from 'axios';

const axiosInstance = axios.create({
    headers:{
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`
    },
    baseURL: import.meta.env.VITE_BASE_URL
})

export {axiosInstance}

// api를 불러올 때 항상 사용하는 코드를 따로 파일로 만들어서 중복된 코드를 방지한다

/*
axiosInstance
    axios.create()를 사용하여 axios의 인스턴스를 생성한 객체
axios
    HTTP 요청을 보내는 라이브러리
    axiosInstance라는 인스턴스를 만들고 있다
headers
    API 요청 헤더에 Authorization 토큰을 포함
baseURL
    API의 기본 URL을 설정
*/