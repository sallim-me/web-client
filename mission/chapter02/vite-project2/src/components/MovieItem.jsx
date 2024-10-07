// components/MovieItem.jsx
import { useState } from 'react'; 
import PropTypes from 'prop-types';

const MovieItem = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false); //hover state 관리

  const handleMouseEnter = () => {
    setIsHovered(true);
  }; //마우스 들어오면 hover true

  const handleMouseLeave = () => {
    setIsHovered(false);
  }; //마우스 나가면 hover false

  return (
    <li
      onMouseEnter={handleMouseEnter} //들어오면 hover
      onMouseLeave={handleMouseLeave} //나가면 hover false
      style={{
        position: 'relative', //부모 요소에 상대적으로
        listStyle: 'none', // 리스트 스타일 제거
        overflow: 'hidden', //자식이 부모를 넘지 않게
        width: '120px',
        height: '180px',
        cursor: 'pointer',
      }}  
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} //이미지 가져오기
        alt={movie.title} 
        style={{
          width: '100%',
          height: '100%',
        }}    
      />
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          }}
        >
        </div>
      )}
    </li>
  );
};

MovieItem.propTypes = { //movie prop 타입 정의
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,  //id는 숫자, 필수
    title: PropTypes.string.isRequired, //title은 문자열, 필수
    poster_path: PropTypes.string.isRequired,// poster_path는 문자열, 필수
  }).isRequired,
};

export default MovieItem;
