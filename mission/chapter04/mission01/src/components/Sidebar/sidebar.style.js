import styled from 'styled-components';

export const SidebarContainer = styled.div`
    position: fixed; // 위치 고정
    top: 60px; // Navbar 바로 아래부터 시작
    left: 0; // 왼쪽 끝 배치
    width: 250px; 
    height: calc(100vh - 60px); // Navbar 높이를 제외한 화면 전체 높이
    background-color: #111; 
    padding: 20px; 
    display: flex; 
    flex-direction: column; // 세로로 요소 배치
    z-index: 900; // 다른 요소 위에 표시
`;

export const Menu = styled.div`
    display: flex; 
    flex-direction: column; // 세로로 배치
    gap: 20px; 
`;

export const MenuItem = styled.div`
    display: flex; 
    align-items: center; // 아이콘과 텍스트를 수평 정렬
    gap: 10px; // 아이콘과 텍스트 사이 간격 설정
    font-size: 18px; // 텍스트 크기
    color: #ccc; // 기본 텍스트 색상 (회색)

    a { // 링크
        text-decoration: none; 
        color: inherit; // 부모 요소 색상(회색) 상속 
    }

    &:hover {
        color: #fff; // 흰색
    }

    svg { // 아이콘
        font-size: 20px; 
    }
`;
