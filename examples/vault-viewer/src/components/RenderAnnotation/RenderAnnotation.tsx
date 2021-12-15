import { useAnnotation, useResources } from '@hyperion-framework/react-vault';
import React, { FC, useMemo } from 'react';
import { RegionHighlight } from '@atlas-viewer/atlas';

export const RenderAnnotation: FC<{ id: string }> = ({ id }) => {
  const annotation = useAnnotation({ id });
  // const ids = useMemo(() => (annotation.body || []).map(r => r.id), [annotation]);
  // const bodies = useResources(ids, 'ContentResource');
  // const targets = useResources(targetIds, 'ContentResource');

  console.log(annotation);

  if (!annotation.target || !(annotation.target as any).selector) {
    return null;
  }

  return (
    <RegionHighlight
      id={annotation.id}
      isEditing={false}
      onClick={() => {
        // no-op
      }}
      onSave={() => {
        // no-op
      }}
      background="rgba(255,0,0,.4)"
      region={(annotation.target as any).selector}
    />
  );
};
