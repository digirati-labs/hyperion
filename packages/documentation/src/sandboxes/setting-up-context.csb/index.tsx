import React from 'react';
import { Sandbox } from '@site/src/components/Sandbox/Sandbox';
import { parseFiles } from '@site/src/utils/parse-files';

// @ts-ignore
const files = parseFiles(require.context('!!raw-loader!./', true, /\.js$/));

export const SettingUpContext = () => {
  return (
    <>
      <Sandbox
        template="react"
        theme={{
          typography: {
            fontSize: '0.75em',
          },
        }}
        options={{
          editorWidthPercentage: 60,
          editorHeight: 400,
        }}
        customSetup={{
          dependencies: {
            react: '16.14.0',
            'react-dom': '16.14.0',
            '@hyperion-framework/react-vault': '*',
          },
        }}
        files={files}
      />
    </>
  );
};
