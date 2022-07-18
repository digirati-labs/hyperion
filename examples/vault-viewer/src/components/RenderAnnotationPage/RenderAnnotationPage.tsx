import React, { FC } from 'react';
import { AnnotationPage } from '@hyperion-framework/types';
import { RenderAnnotation } from '../RenderAnnotation/RenderAnnotation';

export const RenderAnnotationPage: FC<{ page: AnnotationPage }> = ({ page }) => {
  return (
    <>
      {page.items.map(annotation => {
        return <RenderAnnotation key={annotation.id} id={annotation.id} />;
      })}
    </>
  );
};
