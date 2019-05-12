import bem from '@fesk/react-bem';
import './Compose.scss';

export const Compose = bem('compose', block => ({
  Compose: block,
  Title: block.element('title'),
  HelpText: block.element('help-text').asTag('p'),
  BoxButton: block
    .element('box-button')
    .asTag('button')
    .modifier('isActive'),
  BoxButtonIcon: block.element('box-button-icon').asTag('span'),
  TextArea: block
    .element('text-area')
    .asTag('textarea')
    .withProp('rows', 5),
  Footer: block.element('footer'),
  Counter: block.element('counter'),
  PostButton: block.element('post-button').asTag('button'),
}));
