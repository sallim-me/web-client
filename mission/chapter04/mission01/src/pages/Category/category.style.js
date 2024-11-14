import styled from "styled-components";

export const CategoryContainer = styled.div`
    display: flex; 
    align-items: center;
    flex-wrap: wrap;  // 화면 크기에 맞게 줄 바꿈
    padding: 20px;
    background-color: black;
    width: 100%;
`;

export const CategoryBox = styled.div`
    width: 200px;
    height: 100px;
    margin: 10px;
    background-color: #333;  // 어두운 회색
    border-radius: 10px;
    overflow: hidden; 
    position: relative; 
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-5px);  // 5px 위로 이동
    }

    // 카테고리 이름 스타일
    p { 
        position: absolute;  // 절대 위치
        bottom: 10px;  // 박스 하단에서 10px 위
        left: 10px;  // 박스 왼쪽에서 10px
        color: white;
        font-size: 1.2rem;
        font-weight: bold;
        background-color: rgba(0, 0, 0, 0.5);  // 반투명 검정
        padding: 5px 10px;  // 여백
        border-radius: 5px;
    }
`;
