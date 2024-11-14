import styled from 'styled-components';
import Navbar from '../components/Navbar/navbar'; 

export const LayoutContainer = styled.div`
    display: flex; // 가로로 배치
    height: calc(100vh - 60px); // 화면 전체 높이에서 Navbar의 높이를 뺀 값
    margin-top: 60px; // Navbar 고정을 위해 여유 공간 추가 
`;

export const StyledNavbar = styled(Navbar)`  // Navbar 상속
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%;
    z-index: 1000; 
    background-color: #111; 
    height: 60px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center; // 수직 정렬
    padding: 0 20px; // 좌우 여백 설정
`;
//%%% navbar.style.js에서 style을 정의해뒀는데 또 하는 이유가 뭐지. 겹치는 부분도 많음

export const Content = styled.div`
    flex: 1; // 남은 공간을 차지
    margin-left: 290px; // 사이드바 너비만큼의 여백 추가
    padding: 20px; 
    background-color: #000; 
    color: #fff; 
    overflow-y: auto; // 세로 스크롤 유지
    z-index: 500;

    // Webkit 기반 브라우저(크롬, 사파리)에서 스크롤바 숨기기
    ::-webkit-scrollbar {
        display: none; 
    }

    // Firefox에서 스크롤바 숨기기
    scrollbar-width: none;
`;

//%%%스크롤바 왜 숨기지