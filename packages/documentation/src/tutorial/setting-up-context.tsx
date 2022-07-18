import React from 'react';
import { Sandbox } from '@site/src/components/Sandbox/Sandbox';

export const SettingUpContext = () => {
  return (
    <Sandbox
      template="react"
      customSetup={{
        dependencies: {
          react: '16.14.0',
          'react-dom': '16.14.0',
          '@hyperion-framework/react-vault': '*',
        },
      }}
      files={{
        '/App.js': {
          code: `import React from 'react';
import { VaultProvider } from '@hyperion-framework/react-vault';

export default function App() {
 return (
   <VaultProvider>
     <div>
       This is inside the vault.
     </div>
   </VaultProvider>
 );
}`,
        },
      }}
    />
  );
};
