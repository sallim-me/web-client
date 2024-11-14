import * as S from './navbar.style'

const Navbar = () =>{
    return (
        <S.NavbarContainer>
            <S.Logo to="/">YONGCHA</S.Logo> {/*로고를 누르면 홈(/)으로 간다*/}
            <S.AuthButtons>
                <S.LoginButton to="/login">로그인</S.LoginButton>
                <S.SignupButton to="/signup">회원가입</S.SignupButton>
            </S.AuthButtons>
        </S.NavbarContainer>
    )
}

export default Navbar;
