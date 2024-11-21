import styled from 'styled-components';

export const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    background-image: url(${props => props.$backdropPath});
    background-size: cover;
    background-position: center;
    padding: 60px 20px;
    color: #fff;
    box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.7); /* 어두운 오버레이 */
`;

export const Title = styled.h1`
    font-size: 3rem;
    margin: 10px 0;
    font-weight: bold;
`;

export const Rating = styled.p`
    font-size: 1.5rem;
    color: #ffcc00;
    margin: 10px 0;
`;

export const Runtime = styled.p`
    font-size: 1rem;
    color: #ccc;
    margin: 5px 0;
`;

export const Tagline = styled.p`
    font-style: italic;
    color: #ffcc00;
    font-size: 1.2rem;
    margin: 15px 0;
`;

export const Overview = styled.p`
    font-size: 1rem;
    line-height: 1.6;
    max-width: 800px;
    margin: 20px auto;
`;

