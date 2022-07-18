import React, { FC, ReactElement, useState } from 'react';
import {
  Panel,
  PanelBody,
  PanelsLayoutContainer,
  PanelTitle,
  PanelsCenterPanel,
  PanelTitleText,
  PanelToggle,
} from './PanelsLayout.styles';
import { LeftArrowIcon, RightArrowIcon } from './PanelsLayout.icons';

export type PanelsLayoutProps = {
  leftPanel?: {
    enabled: boolean;
    closeDefault: boolean;
    title: string;
    content: ReactElement<any, any>;
  };
  rightPanel?: {
    enabled: boolean;
    closeDefault: boolean;
    title: string;
    content: ReactElement<any, any>;
  };
};

export const PanelsLayout: FC<PanelsLayoutProps> = props => {
  const [leftOpen, setLeftOpen] = useState(!props.leftPanel?.closeDefault);
  const [rightOpen, setRightOpen] = useState(!props.rightPanel?.closeDefault);

  return (
    <PanelsLayoutContainer>
      {props.leftPanel && props.leftPanel.enabled ? (
        <Panel $open={leftOpen}>
          <PanelTitle onClick={() => setLeftOpen(o => !o)}>
            <PanelTitleText>{props.leftPanel.title}</PanelTitleText>
            <PanelToggle>{leftOpen ? <LeftArrowIcon /> : <RightArrowIcon />}</PanelToggle>
          </PanelTitle>
          <PanelBody>{props.leftPanel.content}</PanelBody>
        </Panel>
      ) : null}
      <PanelsCenterPanel>{props.children}</PanelsCenterPanel>
      {props.rightPanel && props.rightPanel.enabled ? (
        <Panel $open={rightOpen}>
          <PanelTitle onClick={() => setRightOpen(o => !o)}>
            <PanelToggle>{rightOpen ? <RightArrowIcon /> : <LeftArrowIcon />}</PanelToggle>
            <PanelTitleText>{props.rightPanel.title}</PanelTitleText>
          </PanelTitle>
          <PanelBody>{props.rightPanel.content}</PanelBody>
        </Panel>
      ) : null}
    </PanelsLayoutContainer>
  );
};
