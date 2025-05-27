import styled from "styled-components";

export const Container = styled.div`
  padding: 16px;
  padding-bottom: 76px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }
`;

export const Title = styled.h1`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  flex: 1;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ScrapButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ImageSection = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Price = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;

  span:first-child {
    color: #666;
    font-size: 16px;
  }
`;

export const AuthorSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProfileInitial = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

export const Author = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const Label = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

export const SpecificationSection = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const SpecificationText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
`;

export const DefectSection = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const DefectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

export const DefectItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span:first-child {
    font-size: 14px;
    color: #666;
  }

  span:last-child {
    font-size: 14px;
    color: #333;
  }
`;

export const Description = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const DescriptionText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  white-space: pre-wrap;
`;

export const CommentSection = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const CommentForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const CommentInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  height: 60px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CommentItem = styled.div`
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  position: relative;
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const CommentAuthor = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export const CommentDate = styled.span`
  font-size: 12px;
  color: #666;
`;

export const CommentContent = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin: 0;
`;
