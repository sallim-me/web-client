import Card from '../../components/Card/card.jsx'; 
import * as S from './movie.style.js'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { useCustomFetch } from '../../hooks/useCustomFetch.js';

const MoviePage = () => {
    const {category_or_movieid} = useParams();
    console.log("***" + category_or_movieid); // 이거 console에 왜 6번씩 뜨지%%%
    const navigate = useNavigate();
    const {data, isLoading, isError} = useCustomFetch(category_or_movieid);  // 마음에 안들어...%%%

    if (isLoading) {
        return <p>로딩 중...</p>;
    }
    if (isError) {
        return <p>에러 발생!</p>;
    }

    const handleCardClick = (movie) => {
        console.log("***handleCardClick")
        navigate(`/movie/${movie.id}`);
    } // 이거 맞나...?%%%

    return (
        <S.CardList>
            {
                data.map((movie) => (
                <Card 
                    key={movie.id} 
                    movie={movie} 
                    onClick={()=>handleCardClick(movie.id)} 
                /> // 각 영화 정보를 Card 컴포넌트에 전달하여 렌더링
            ))
        }
        </S.CardList>
    );
};

export default MoviePage;


