import {useEffect, useState} from 'react';
import {axiosInstance} from '../apis/axios-instance';  // axios-instance를 그대로 사용

const useCustomFetch = (url) => { // category 말고 url 받는 걸로 만들고 싶은데%%%
    const [data, setData] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => { 
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(url); 
                console.log(response.data);
                setData(response.data); // 받아온 데이터로 상태 업데이트
                // movie에서는 .results 받아와야 하고 details에서는 credit(casting) 받기
                // https://developer.themoviedb.org/reference/movie-details
            } catch (error) {
                setIsError(error);
            } finally {
                setIsLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url]);

    return {data, isLoading, isError};
}

export {useCustomFetch};
