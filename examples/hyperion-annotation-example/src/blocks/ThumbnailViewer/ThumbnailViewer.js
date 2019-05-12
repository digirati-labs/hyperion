import bem from '@fesk/react-bem';
import './ThumbnailViewer.scss';

export const ThumbnailViewer = bem('thumbnail-viewer', block => ({
  ThumbnailViewer: block.modifier('book-view').modifier('square').modifier('large-cover'),
  Thumbnail: block.element('thumbnail').modifier('cover').modifier('selected'),
  ThumbnailImage: block.element('thumbnail-image').asTag('img'),
  ThumbnailWrapper: block.element('thumbnail-wrapper'),
}));
