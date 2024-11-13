import Card from '../../components/Card/card.jsx'; 
import * as S from './movie.style.js'; 
import { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import { axiosInstance } from '../../apis/axios-instance.js';
import { useCustomFetch } from '../../hooks/useCustomFetch.js';

const APIurl = {
    "now-playing": `/movie/now_playing?language=ko-KR&page=1`, 
    "popular": `/movie/popular?language=ko-KR&page=1`,
    "top-rated": `/movie/top_rated?language=ko-KR&page=1`,
    "up-coming": `/movie/upcoming?language=ko-KR&page=1`
    // https://api.themoviedb.org/까지 동일해서 axios-instance.js에서 VITE_BASE_USL로 묶는다
}

const MoviePage = () => {
    const {category} = useParams();
    const {data, isLoading, isError} = useCustomFetch(APIurl[category])
    
    if (isLoading) {
        return <p>로딩 중...</p>; 
    }
    if(isError) {
        return <p>에러 발생!</p>;
    }

    return (
        <S.CardList>
            {data.data?.results.map((movie) => (
                <Card key={movie.id} movie={movie} /> // 각 영화 정보를 Card 컴포넌트에 전달하여 렌더링
            ))}
        </S.CardList>
    );
};

export default MoviePage; 