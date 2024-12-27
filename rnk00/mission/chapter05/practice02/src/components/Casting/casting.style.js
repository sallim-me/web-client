import styled from 'styled-components';

// CastContainer: 캐스트 컴포넌트를 감싸는 최상위 컨테이너
export const CastContainer = styled.div`
    margin-top: 40px; // 상단에 40px의 여백을 추가합니다.
    padding: 20px; // 내부 여백을 20px로 설정하여 콘텐츠와 테두리 사이 간격을 만듭니다.
`;

// CastTitle: 캐스트 섹션의 제목 스타일을 정의하는 컴포넌트
export const CastTitle = styled.h2`
    font-size: 2rem; // 제목의 폰트 크기를 2rem로 설정합니다.
    text-align: center; // 텍스트를 중앙 정렬합니다.
    margin-bottom: 20px; // 하단에 20px 여백을 추가하여 다음 요소와 간격을 둡니다.
`;

// CastList: 캐스트 목록을 감싸는 컨테이너로, 캐스트 항목을 배치합니다.
export const CastList = styled.div`
    display: flex; // 플렉스 박스를 사용하여 내부 항목을 정렬합니다.
    flex-wrap: wrap; // 내부 항목들이 넘칠 경우 줄 바꿈이 되도록 설정합니다.
    justify-content: center; // 중앙 정렬하여 모든 항목이 가운데로 오도록 설정합니다.
    gap: 15px; // 각 항목 간에 15px의 간격을 추가합니다.
    margin-top: 20px; // 상단에 20px의 여백을 추가하여 위 요소와 간격을 둡니다.
`;

// CastItem: 각 캐스트 멤버의 정보를 표시하는 개별 항목 스타일을 정의하는 컴포넌트
export const CastItem = styled.div`
    display: flex; // 플렉스 박스를 사용하여 내부 요소를 정렬합니다.
    flex-direction: column; // 세로 방향으로 정렬하여 이미지와 텍스트가 위아래로 위치하게 합니다.
    align-items: center; // 내부 요소들을 중앙 정렬합니다.
    width: 100px; // 각 항목의 너비를 100px로 고정합니다.
    text-align: center; // 텍스트를 중앙 정렬하여 요소 내에서 균형을 잡습니다.

    img {
        width: 100%; // 이미지의 너비를 100%로 설정하여 부모 요소에 맞춥니다.
        height: 100px; // 이미지 높이를 100px로 설정합니다.
        border-radius: 50%; // 둥근 모서리로 설정하여 원형 모양으로 만듭니다.
        margin-bottom: 10px; // 이미지 아래에 10px의 여백을 추가합니다.
        border: 2px solid white; // 이미지 테두리를 흰색 2px로 설정합니다.
    }

    p {
        margin: 5px 0; // 상하단에 5px 여백을 추가하여 텍스트 간격을 조정합니다.
        font-size: 0.9rem; // 텍스트의 폰트 크기를 0.9rem로 설정합니다.
    }
`;
