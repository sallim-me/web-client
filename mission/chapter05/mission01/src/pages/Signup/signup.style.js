import styled from 'styled-components';

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 화면 전체 높이 -> 화면에서 중앙에 위치*/
    width: 100%;
`;

export const Input = styled.input`
    height: 40px;
    width: 300px;
    border-radius: 5px; 
    border: 1px solid #ccc; /* 테두리 추가 */
    box-sizing: border-box; /* 패딩과 테두리를 포함한 크기 계산 */
    padding: 3px; /* 여백 추가 */
`;

export const Err = styled.p`
    font-size: 10px;
    color: red;
`;

export const Submit = styled.button`
    height: 40px;
    width: 300px;
    border-radius: 3px; 
    background-color: #f04e4e;
    color: white;
    font-weight: 500;
    border: none; /* 기본 버튼 테두리 제거 */
    box-sizing: border-box; /* 크기 계산을 border 포함으로 설정 */
`;
