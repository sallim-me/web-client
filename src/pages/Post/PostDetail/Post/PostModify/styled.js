import styled from "styled-components";

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
  padding-bottom: 80px;
`;

export const Form = styled.form`
  padding: 24px;
`;

export const Section = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #bddde4;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 8px;
  &:focus {
    outline: none;
    border-color: #9ec6f3;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #bddde4;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 8px;
  &:focus {
    outline: none;
    border-color: #9ec6f3;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #bddde4;
  border-radius: 8px;
  font-size: 16px;
  min-height: 80px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #9ec6f3;
  }
`;

export const ImageUploadButton = styled.label`
  display: inline-block;
  padding: 8px 16px;
  background: #bddde4;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const QuestionBox = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
`;

export const Question = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #9ec6f3;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 16px;
  &:hover {
    background: #9fb3df;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 24px 0;
`;
