import styled from 'styled-components';

// InfoContainer: 영화 정보를 표시하는 최상위 컨테이너 스타일을 정의
export const InfoContainer = styled.div`
    display: flex; // 플렉스 박스를 사용하여 내부 요소 정렬
    flex-direction: column; // 요소들을 세로 방향으로 정렬
    align-items: center; // 요소들을 중앙에 정렬
    text-align: center; // 텍스트를 중앙 정렬
    background-image: url(${props => props.$backdropPath}); // 배경 이미지를 props에서 받아 설정
    background-size: cover; // 배경 이미지를 컨테이너 크기에 맞추어 확대/축소
    background-position: center; // 배경 이미지의 중앙을 기준으로 정렬
    padding: 60px 20px; // 컨테이너의 내부 여백을 상하 60px, 좌우 20px로 설정
    color: #fff; // 텍스트 색상을 흰색으로 설정
    box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.7); // 어두운 오버레이를 추가하여 배경과 텍스트 대비 강화
`;

// Title: 영화 제목의 스타일을 정의
export const Title = styled.h1`
    font-size: 3rem; // 폰트 크기를 3rem으로 설정
    margin: 10px 0; // 상하단 여백을 10px로 설정하여 다른 요소들과 간격을 둠
    font-weight: bold; // 폰트를 굵게 설정
`;

// Rating: 영화 평점을 표시하는 스타일 정의
export const Rating = styled.p`
    font-size: 1.5rem; // 폰트 크기를 1.5rem으로 설정
    color: #ffcc00; // 평점 텍스트를 밝은 노란색으로 설정
    margin: 10px 0; // 상하단에 10px 여백을 추가
`;

// Runtime: 영화의 상영 시간을 표시하는 스타일 정의
export const Runtime = styled.p`
    font-size: 1rem; // 폰트 크기를 1rem으로 설정
    color: #ccc; // 상영 시간 텍스트를 회색으로 설정
    margin: 5px 0; // 상하단에 5px 여백을 추가하여 요소 간격을 조정
`;

// Tagline: 영화의 슬로건을 스타일링
export const Tagline = styled.p`
    font-style: italic; // 폰트를 이탤릭체로 설정하여 강조
    color: #ffcc00; // 슬로건을 밝은 노란색으로 설정
    font-size: 1.2rem; // 폰트 크기를 1.2rem으로 설정
    margin: 15px 0; // 상하단에 15px 여백을 추가
`;

// Overview: 영화 줄거리 스타일 정의
export const Overview = styled.p`
    font-size: 1rem; // 폰트 크기를 1rem으로 설정
    line-height: 1.6; // 줄 간격을 1.6으로 설정하여 가독성 향상
    max-width: 800px; // 최대 너비를 800px로 제한하여 텍스트가 지나치게 넓어지지 않도록 조정
    margin: 20px auto; // 상하 20px 여백을 추가하고 좌우 중앙 정렬
`;
