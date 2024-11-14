import styled from 'styled-components';

export const CastContainer = styled.div`
    margin-top: 40px;
    padding: 20px;
`;

export const CastTitle = styled.h2`
    font-size: 2rem;
    text-align: center;
    margin-bottom: 20px;
`;

export const CastList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
`;

export const CastItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    text-align: center;
    
    img {
        width: 100%;
        height: 100px;
        border-radius: 50%;
        margin-bottom: 10px;
        border: 2px solid white;
    }

    p {
        margin: 5px 0;
        font-size: 0.9rem;
    }
`;
