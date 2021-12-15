import { SandpackFiles } from '@codesandbox/sandpack-react/dist/types/types';

export function parseFiles(req: any): SandpackFiles {
  return req.keys().reduce((state, key) => {
    return {
      ...state,
      [key.slice(1)]: req(key).default,
    };
  }, {});
}
