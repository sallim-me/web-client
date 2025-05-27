import styled from "styled-components";

export const Container = styled.div`
  width: 80%;
  max-width: 600px;
  padding: 20px;
  margin: 0 auto 60px;
  background-color: #fff;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #bddde4;
  width: 100%;
  box-sizing: border-box;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #bddde4;
  margin: 8px 0;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #bddde4;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
  &::placeholder {
    color: #999;
  }
  &:focus {
    outline: none;
    border-color: #9fb3df;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #bddde4;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #9fb3df;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid #bddde4;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  resize: vertical;
  box-sizing: border-box;
  &::placeholder {
    color: #999;
  }
  &:focus {
    outline: none;
    border-color: #9fb3df;
  }
`;

export const ImageUploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 120px;
  border: 2px dashed #bddde4;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #fff;
  box-sizing: border-box;

  span {
    color: #666;
    font-size: 14px;
  }

  &:hover {
    border-color: #9fb3df;
    span {
      color: #9fb3df;
    }
  }
`;

export const QuestionBox = styled.div`
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #bddde4;
  width: 100%;
  box-sizing: border-box;
`;

export const Question = styled.p`
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 24px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }

  input[type="radio"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #9ec6f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background-color: #9fb3df;
  }

  &:disabled {
    background-color: #bddde4;
    cursor: not-allowed;
  }
`;
