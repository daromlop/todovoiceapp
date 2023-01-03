import styled from "styled-components";

export const CustomTitle = styled.h1`
  color: white;
  margin: 20px 0px 70px;
`;

export const InputDiv = styled.div`
  display: flex;
  width: 80%;
  flex-flow: row nowrap;
  margin: 0 auto;
  border-right: 0px;
  border-left: 0px;
  border-radius: 5px;
`;

export const TaskDiv = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 25px auto;
  padding: 20px;
  border-radius: 5px;
  font-weight: 500;
  color: white;
`;

export const ButtonToDo = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  background: rgba(0, 0, 0, 0);
`;
