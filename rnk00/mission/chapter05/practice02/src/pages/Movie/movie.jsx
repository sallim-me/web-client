import Card from '../../components/Card/card.jsx'; 
import * as S from './movie.style.js'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { useCustomFetch } from '../../hooks/useCustomFetch.js';

const APIurl = {
    "now-playing": `/movie/now_playing?language=ko-kr&page=1`, 
    "popular": `/movie/popular?language=ko-kr&page=1`,
    "top-rated": `/movie/top_rated?language=ko-kr&page=1`,
    "up-coming": `/movie/upcoming?language=ko-kr&page=1`
};

const MoviePage = () => {
    const { category_or_movieid } = useParams();
    console.log("***" + category_or_movieid); 
    const navigate = useNavigate();
    const { data, isLoading, isError } = useCustomFetch(APIurl[category_or_movieid]); 
    //왜 /movie/${category_or_movieid}?language=ko-kr&page=1로 하면 안되지
    console.log("data: "+data);
    
    if (isLoading) {
        return <p>로딩 중...</p>;
    }
    if (isError) {
        return <p>에러 발생!</p>;
    }



    const handleCardClick = (movieId) => {
        console.log("***handleCardClick");
        navigate(`/movie/${movieId}`); 
    }

    return (
        <S.CardList>
            {
                data.results && data.results.length > 0 ? (
                    data.results.map((movie) => (
                        <Card 
                            key={movie.id} 
                            movie={movie} 
                            onClick={() => handleCardClick(movie.id)} 
                        />
                    ))
                ) : (
                    <p>영화 정보가 없습니다.</p>  // results가 없을 때 출력할 메시지
                )
            }
        </S.CardList>
    );
};

export default MoviePage;
