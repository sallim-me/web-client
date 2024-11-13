import {useEffect, useState} from 'react';
import {axiosInstance} from '../apis/axios-instance';

const APIurl = {
    "now-playing": `/movie/now_playing?language=ko-KR&page=1`, 
    "popular": `/movie/popular?language=ko-KR&page=1`,
    "top-rated": `/movie/top_rated?language=ko-KR&page=1`,
    "up-coming": `/movie/upcoming?language=ko-KR&page=1`
}

const useCustomFetch = (category) => {
    const [data, setData] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => { //%%%
            setIsLoading(true);
            try{
                const response = await axiosInstance.get(APIurl[category]);
                setData(response.data); // 받아온 데이터로 상태 업데이트
            }
            catch(error){
                setIsError(error);
            }
            finally{
                setIsLoading(false);
            }
        }
    
        // category가 존재할 때만 API 호출
        if (category) {
            fetchData();
        }
    }, [category]);

    return {data, isLoading, isError};
}

export {useCustomFetch}

// const {data, isLoading, isError} = useCustomFetch('url')을 어디에서든 쓸 수 있다