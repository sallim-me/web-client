import Card from '../../components/Card/card.jsx'; 
import * as S from './movie.style.js'; 
import { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import axios from 'axios'; 

const APIurl = {
    "now-playing": "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1", 
    "popular": "https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1",
    "top-rated": "https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1",
    "up-coming": "https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1"
}

const MoviePage = () => {
    const {category} = useParams(); // path를 movies/:category로 설정했기 때문에 URL에서 movie/ 다음에 오는 것을 category롤 받아온다
    const [movies, setMovies] = useState([]); // movies: API로 받아온 영화 데이터들을 저장하는 변수. setMovies: 영화 데이터를 업데이트하는 함수

    // useEffect로 영화 데이터를 가져옴
    useEffect(() => {
        const getMovies = async () => { //%%%
            const response = await axios.get(APIurl[category], { // API 호출하여 영화 데이터를 받아옴
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}` // API 인증 토큰 헤더로 전달
                }
            });
            setMovies(response); // 받아온 데이터로 상태 업데이트
        }

        // category가 존재할 때만 API 호출
        if (category) {
            getMovies();
        }
    }, [category]); // 'category'가 변경될 때마다 다시 실행됨

    console.log(movies);

    return (
        <S.CardList>
            {movies.data?.results.map((movie) => (
                <Card key={movie.id} movie={movie} /> // 각 영화 정보를 Card 컴포넌트에 전달하여 렌더링
            ))}
        </S.CardList>
    );
};

export default MoviePage; 