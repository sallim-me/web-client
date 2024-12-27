import styled from 'styled-components';

export const CardContainer = styled.div`
    position: relative;  // 위치를 상대적으로
    width: 150px;
    height: 265px;
    border-radius: 10px;
    overflow: hidden;  // 카드 영역을 벗어나는 내용을 숨김
    cursor: pointer;
    transition: transform 0.3s ease-in-out;  // 카드의 크기 변화를 부드럽게 전환

    &:hover div {  // &로 자기 자신 선택
        opacity: 1;  
    }
`; // 백틱(`) 사용

export const CardImage = styled.img`
    width: 100%; 
    height: 85%;
    border-radius: 10px; 
    object-fit: cover;  // 이미지를 영역에 맞게 자름
`;

export const MovieTitle = styled.h3`
    font-size: 0.5rem; 
    color: white;
`;

export const ReleaseDate = styled.p`
    font-size: 0.5rem; 
    color: grey;
`;

// 카드 hover 시 배경 색상과 투명도를 설정
export const Hover = styled.div`
    position: absolute;  // 절대 위치로 설정 -> 카드 위에 겹치게 배치
    top: 0;  // 카드의 상단에 위치
    left: 0;  // 카드의 왼쪽에 위치
    width: 100%;  // 카드의 너비에 맞게 
    height: 100%;  // 카드의 높이에 맞게 
    background-color: rgba(0, 0, 0, 0.7);  // 검정색 배경에 70% 투명도
    opacity: 0;  // 기본 상태에서는 투명도 0 (보이지 않음)
    transition: opacity 0.3s ease-in-out;  // opacity 변화에 애니메이션 적용
`;
