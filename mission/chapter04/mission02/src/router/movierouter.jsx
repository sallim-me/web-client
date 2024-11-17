import { useParams } from "react-router-dom";
import MoviePage from "../pages/Movie/movie";
import DetailPage from "../pages/Detail/detail";

const MovieRouter = () => {
    const { category_or_movieid } = useParams();
    const isNumber = /^\d+$/.test(category_or_movieid);  // 숫자인지 확인하는 정규 표현식

    // 숫자면 DetailPage 아니면 MoviePage
    return isNumber ? <DetailPage movieId={category_or_movieid} /> 
                    : <MoviePage category={category_or_movieid} />
}

export default MovieRouter;
