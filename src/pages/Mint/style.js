import styled from "styled-components";

export const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;
export const Container = styled.div`
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Fieldset = styled.fieldset`
  width: 80%;
  height: 50%;
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  align-items: center;
`;

export const Legend = styled.legend`
  font-size: 20px;
`;

export const InputBox = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AddInput = styled.input`
  height: 30px;
  width: 70%;
  font-size: 15px;
  border-radius: 10px;
  padding: 0px 15px;
`;
export const AddButton = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
`;
export const Root = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;
export const List = styled.fieldset`
  margin: 20px;
  width: 90%;
  height: 100%;
  border-radius: 10px;
  overflow-y: scroll;
`;

export const ButtonBoxContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Mint = styled.button`
  padding: 15px;
`;
export const WalletConnect = styled.button`
  padding: 15px;
  margin-bottom: 40px;
`;
