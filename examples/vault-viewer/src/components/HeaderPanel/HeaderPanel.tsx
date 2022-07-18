import React, { FC, useEffect, useState } from 'react';
import {
  HeaderPanelButton,
  HeaderPanelContainer,
  HeaderPanelRight,
  SwitcherButton,
  SwitcherContainer,
  SwitcherInput,
  SwitcherText,
  HeaderPanelCenter,
} from './HeaderPanel.styles';
import { FirstIcon, LastIcon, NextIcon, PreviousIcon, SettingsIcon } from './HeaderPanel.icons';
import { useSimpleViewer } from '@hyperion-framework/react-vault';

export const HeaderPanel: FC = () => {
  const { totalCanvases, currentCanvasIndex, nextCanvas, previousCanvas, setCurrentCanvasIndex } = useSimpleViewer();
  const [input, setInput] = useState(currentCanvasIndex);

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentCanvasIndex(input);
  };

  useEffect(() => {
    setInput(currentCanvasIndex);
  }, [currentCanvasIndex]);

  return (
    <HeaderPanelContainer>
      <HeaderPanelCenter>
        <HeaderPanelButton disabled={currentCanvasIndex === 0} onClick={() => setCurrentCanvasIndex(0)}>
          <FirstIcon />
        </HeaderPanelButton>
        <HeaderPanelButton disabled={currentCanvasIndex === 0} onClick={previousCanvas}>
          <PreviousIcon />
        </HeaderPanelButton>
        <SwitcherContainer onSubmit={onSubmitForm}>
          <SwitcherText>Image</SwitcherText>
          <SwitcherInput
            type="number"
            value={input === -1 ? '' : input + 1}
            onChange={e => {
              if (e.currentTarget.value === '') {
                setInput(-1);
              }
              const newValue = Number(e.currentTarget.value) - 1;
              if (newValue >= 0 && newValue < totalCanvases) {
                setInput(Number(e.currentTarget.value) - 1);
              }
            }}
          />
          <SwitcherText>of {totalCanvases}</SwitcherText>
          <SwitcherButton type="submit">Go</SwitcherButton>
        </SwitcherContainer>
        <HeaderPanelButton disabled={currentCanvasIndex === totalCanvases - 1} onClick={nextCanvas}>
          <NextIcon />
        </HeaderPanelButton>
        <HeaderPanelButton
          disabled={currentCanvasIndex === totalCanvases - 1}
          onClick={() => setCurrentCanvasIndex(totalCanvases - 1)}
        >
          <LastIcon />
        </HeaderPanelButton>
      </HeaderPanelCenter>

      <HeaderPanelRight>
        <HeaderPanelButton>
          <SettingsIcon />
        </HeaderPanelButton>
      </HeaderPanelRight>
    </HeaderPanelContainer>
  );
};
