import styled from "styled-components";

export const Container = styled.div`
  padding: 12px 12px 76px 12px;
  max-width: 100%;
  box-sizing: border-box;
`;

export const FilterSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
`;

export const CategoryGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
`;

export const StatusGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

export const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #bddde4;
  background: ${(props) => (props.isActive ? "#9FB3DF" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#666")};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    border-color: #9fb3df;
    color: ${(props) => (props.isActive ? "white" : "#9FB3DF")};
  }
`;

export const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
`;

export const AddButton = styled.button`
  position: fixed;
  right: 16px;
  bottom: 76px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #9ec6f3;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;

  &:hover {
    background-color: #9fb3df;
  }
`;
