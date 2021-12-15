import styled, { css } from 'styled-components';

export const PanelsLayoutContainer = styled.div`
  display: flex;
  flex: 1 1 0px;
`;

export const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const PanelBody = styled.div`
  color: #fff;
  min-width: 255px;
`;

export const PanelsCenterPanel = styled.div`
  flex: 1 1 0px;
  min-width: 0;
  background: #000;
`;

export const PanelTitleText = styled.div`
  color: #fff;
  text-transform: uppercase;
  font-size: 0.8em;
  margin-right: auto;
  padding: 0.5em 0.5em;
  display: block;
  white-space: nowrap;
  transform-origin: top left;
`;

export const PanelToggle = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  svg {
    fill: #fff;
  }
`;

export const Panel = styled.div<{ $open?: boolean }>`
  background: #212121;
  margin: 0.5em;
  width: 255px;
  position: relative;
  transition: width 0.3s;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100%;

  ${props =>
    !props.$open &&
    css`
      width: 35px;
      ${PanelTitleText} {
        position: absolute;
        transform: rotate(90deg) translate(28px, -32px);
        transition: transform 0.3s;
      }
      ${PanelBody} {
        display: none;
      }
    `}
`;
