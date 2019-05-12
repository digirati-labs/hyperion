import bem from '@fesk/react-bem';
import './TwitterLogin.scss';

export const TwitterLogin = bem('twitter-login', block => ({
  TwitterLogin: block,
  EmptyState: block.element('empty-state'),
  LoginButton: block.element('login-button').asTag('button'),
  PrivacyText: block.element('privacy-text'),
}));
