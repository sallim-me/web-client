import * as S from './casting.style';

const Casting = ({ cast }) => {
    return (
        <S.CastContainer>
            <S.CastTitle>감독/출연</S.CastTitle>
            <S.CastList>
                {cast.map((actor) => (
                    <S.CastItem key={actor.id}>
                        <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                        <p>{actor.name}</p>
                        <p>({actor.character})</p>
                    </S.CastItem>
                ))}
            </S.CastList>
        </S.CastContainer>
    );
};

export default Casting;
