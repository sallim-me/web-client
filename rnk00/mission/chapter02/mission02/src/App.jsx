import { MOVIES } from './mocks/movies';
import MovieItem from './components/MovieItem'; 

const App = () => {
  return (
    <div>
      <h1>Movies List</h1>
      <ul className="movie_list">
        {MOVIES.results.map(movie => (
          <MovieItem key={movie.id} movie={movie} /> 
        ))} 
      </ul>
    </div>
  );
};

export default App;

/*
화면에 나타나는 내용
Movies List 밑에 영화 포스터 나옴
*/

// 민은 useState로 뭘 하는 거지%%%%
// map을 통해 하나하나 다 열거해줌%%% 제대로 해서 위에다 주석 달기
// MovieItem 받아오는 방식이 민이랑 다르네

// 저기 안에서 주석 쓰려면 어떻게 해야 되냐%%%