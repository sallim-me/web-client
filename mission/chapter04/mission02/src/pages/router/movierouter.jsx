import { useParams } from "react-router-dom";
import MoviePage from "../Movie/movie";
import DetailPage from "../Detail/detail";

const MovieRouter = () => {
    const { categoryOrmovieId } = useParams();
    const isNumber = /^\d+$/.test(categoryOrmovieId);
    
    return isNumber ? <DetailPage movieId ={categoryOrmovieId} />
                    : <MoviePage category ={categoryOrmovieId}/>
}

export default MovieRouter;