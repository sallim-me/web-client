import * as S from './movieinfo.style';

const MovieInfo = ({ backdropPath, title, voteAverage, runtime, tagline, overview }) => {
    return (
        <S.InfoContainer $backdropPath={backdropPath}>
            <S.Title>{title}</S.Title>
            <S.Rating>평균 {voteAverage}</S.Rating>
            <S.Runtime>{runtime}분</S.Runtime>
            <S.Tagline>{tagline}</S.Tagline>
            <S.Overview>{overview}</S.Overview>
        </S.InfoContainer>
    );
};

export default MovieInfo;
