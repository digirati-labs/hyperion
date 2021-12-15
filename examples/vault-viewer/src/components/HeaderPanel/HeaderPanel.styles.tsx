import styled from 'styled-components';

export const HeaderPanelContainer = styled.div`
  position: relative;
  color: #fff;
  background: #212121;
  display: flex;
  padding: 0.4em 0;
`;

export const HeaderPanelCenter = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

export const HeaderPanelButton = styled.button`
  background-color: #565656;
  padding: 0.2em 0.4em;
  margin: 0 0.15em;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.3s, opacity 0.3s;

  svg {
    fill: #fff;
  }

  &:disabled {
    background-color: transparent;
    opacity: 0.65;
    cursor: not-allowed;
    &:hover {
      background-color: transparent;
    }
  }
  &:hover {
    background-color: #343434;
  }
  &:focus-visible {
  }
`;

export const SwitcherContainer = styled.form`
  display: flex;
  align-items: center;
  margin: 0 1em;
`;

export const SwitcherText = styled.div`
  color: #fff;
  font-size: 0.8em;
`;

export const SwitcherInput = styled.input`
  width: 3em;
  margin: 0 0.3em;
`;

export const SwitcherButton = styled.button`
  border: none;
  color: #fff;
  flex-grow: 1;
  background-color: #634683;
  padding: 0.2em 0.4em;
  margin: 0 0.15em;
  margin-left: 0.5em;
`;

export const HeaderPanelRight = styled.div`
  align-self: flex-end;
  display: flex;
  justify-content: flex-end;
`;
