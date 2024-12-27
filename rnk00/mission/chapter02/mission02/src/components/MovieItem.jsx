import { useState } from 'react'; 
import PropTypes from 'prop-types';

import "../App.css"

const MovieItem = ({ movie }) => { // 민 방식이랑 다름%%%
  return (
    <div className="poster_items"> 
      <img className="poster_img"
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} //이미지 가져오기
        alt={movie.title} 
      />
      <div className="poster_hover"></div>
    </div>
  );
};

MovieItem.propTypes = { //movie prop 타입 정의
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,  //id는 숫자, 필수
    title: PropTypes.string.isRequired, //title은 문자열, 필수
    poster_path: PropTypes.string.isRequired,// poster_path는 문자열, 필수
  }).isRequired,
};
// 이거 왜 하는 거지%%%

export default MovieItem;

//전체적으로 코드가 잘 이해가 안돼%%%
// 너무 덕지덕지 느낌%%%