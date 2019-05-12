import bem from '@fesk/react-bem';
import './PageLayout.scss';

export const PageLayout = bem('page-layout', block => ({
  PageLayout: block.modifier('isLeftPanelHidden'),
  Header: block.element('header'),
  LeftPanel: block.element('left-panel'),
  RightPanel: block.element('right-panel'),
  Content: block.element('content'),
  Footer: block.element('footer'),
  ActionPanel: block.element('action-panel'),
}));
