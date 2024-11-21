import styled from 'styled-components'; 
import { Link } from 'react-router-dom';

export const NavbarContainer = styled.nav`
    display: flex;  
    justify-content: space-between;  // Logo와 AuthButtons를 양 끝으로 배치
    align-items: center;  // 세로 방향으로 중앙 정렬
    padding: 10px 20px;  // 위아래 10px, 좌우 20px 패딩
    background-color: #111;  // 어두운 회색
    height: 60px; 
    position: fixed;  // 위치 고정
    top: 0;  // 페이지 상단에 고정
    left: 0;  // 페이지 왼쪽에 고정
    width: calc(100% - 40px);  // 전체 너비에서 40px을 뺀 너비 (좌우 여백 20px씩 고려)
    z-index: 1000;  // 다른 요소들보다 위에 표시
`;

export const Logo = styled(Link)` //Link는 여기 왜 있지%%%
    font-size: 24px;  
    font-weight: bold; 
    color: #f04e4e;  // 붉은색
    text-decoration: none;  // 밑줄 제거
    &:hover {
        color: #fff;  // 흰색
    }
`;

export const AuthButtons = styled.div`
    display: flex;  // 가로로 나열
    gap: 15px;
`;

export const LoginButton = styled(Link)`
    padding: 8px 16px;
    border: none;
    background-color: transparent; 
    color: #ccc;  // 밝은 회색
    border-radius: 4px;  
    text-decoration: none; 
    &:hover { 
        color: #fff;  // 흰색
    }
`;

export const SignupButton = styled(Link)`
    padding: 8px 16px; 
    border: none; 
    background-color: #f04e4e;  // 붉은색
    color: #fff;  // 흰색
    border-radius: 4px;  
    text-decoration: none; 
    &:hover { 
        background-color: #d43a3a;  // 어두운 붉은색
    }
`;
