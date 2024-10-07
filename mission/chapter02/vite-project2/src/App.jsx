// App.jsx
import { MOVIES } from './mocks/movies';
import MovieItem from './components/MovieItem'; 

const App = () => {
  return (
    <div>
      <h1>Movies List</h1>
      <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
        {MOVIES.results.map(movie => (
          <MovieItem key={movie.id} movie={movie} /> 
        ))}
      </ul>
    </div>
  );
};

export default App;
