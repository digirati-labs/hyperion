import React from 'react';
import { Sandpack, SandpackProps } from '@codesandbox/sandpack-react';
import useThemeContext from '@theme/hooks/useThemeContext';
// @ts-ignore
import App from '!!raw-loader!../../sandboxes/example.csb/App';

export const Sandbox = (props: SandpackProps): JSX.Element => {
  const { isDarkTheme } = useThemeContext();

  return (
    <Sandpack
      files={{
        '/App.js': {
          code: App,
        },
      }}
      theme={isDarkTheme ? 'dark' : 'light'}
      template="vanilla-ts"
      {...props}
    />
  );
};
