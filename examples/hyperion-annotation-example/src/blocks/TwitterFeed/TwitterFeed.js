import bem from '@fesk/react-bem';
import './TwitterFeed.scss';

export const TwitterFeed = bem('twitter-feed', block => ({
  Feed: block,
  Tweet: block.element('tweet').modifier('isSelected'),
  Author: block.element('author').asTag('a'),
  AuthorName: block.element('author-name').asTag('span'),
  AuthorHandle: block.element('author-handle').asTag('span'),
  Contents: block.element('contents').asTag('p'),
  Link: block.element('link').asTag('a').modifier('collapsible'),
  EmptyState: block.element('empty-state'),
  LoginButton: block.element('login-button').asTag('button'),
  PrivacyText: block.element('privacy-text'),
}));
