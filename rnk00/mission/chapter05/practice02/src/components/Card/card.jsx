import * as S from './card.style';

const Card = ({movie, onClick}) => { 
    return (
        <S.CardContainer onClick={onClick}> {/*onClick 설정해야함 */}
            <S.CardImage
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                // movie.poster_path 받아와야 해서 백틱 써야 함
                alt={movie.title}
            />
            <S.MovieTitle>{movie.title}</S.MovieTitle>
            <S.ReleaseDate>{movie.release_date}</S.ReleaseDate>
            <S.Hover/>
        </S.CardContainer>
    )
}

export default Card;