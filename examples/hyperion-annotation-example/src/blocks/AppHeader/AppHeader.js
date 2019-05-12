import bem from '@fesk/react-bem';
import './AppHeader.scss';

export const AppHeader = bem('app-header', header => ({
  Header: header,
  Resource: header.element('resource'),
  ResourceHeading: header.element('resource-heading'),
  ResourceLink: header.element('resource-link').asTag('a'),
  Menu: header.element('menu'),
  MenuItem: header.element('menu-item').modifier('isSelected'),
  Logo: header.element('logo'),
}));
