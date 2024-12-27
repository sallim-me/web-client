import MovieInfo from '../../components/MovieInfo/movieinfo.jsx';
import Casting from '../../components/Casting/casting.jsx';
import { useCustomFetch } from '../../hooks/useCustomFetch.js';
import * as S from './detail.style.js';

const DetailPage = ({ movieId }) => {
    console.log("detail page에 들어옴")
    const { data : movie, error, loading } = useCustomFetch(`/movie/${movieId}?language=ko-KR&append_to_response=credits`);
    if (loading) {
        return <p>로딩 중...</p>;
    }
    if (error) {
        return <p>에러</p>;
    }
    if (!movie) {
        return <p>영화 데이터를 불러올 수 없습니다.</p>; 
    } //%%% 상세페이지 안나오는디... 왜냐

    return (
        <S.DetailContainer>
            <MovieInfo
                backdropPath={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                title={movie.title}
                voteAverage={movie.vote_average}
                runtime={movie.runtime}
                tagline={movie.tagline}
                overview={movie.overview}
            />
            <Casting cast={movie.credits?.cast || []} />
        </S.DetailContainer>
    );
};

export default DetailPage;
