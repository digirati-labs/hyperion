import { reactContextFactory } from '../utility/reactContextFactory';
import { manifestContext } from '@hyperion-framework/vault';

const { hyperionContext, ReactContext, Wrapper } = reactContextFactory(manifestContext, '');

export const ManifestProvider = Wrapper;
export const ManifestReactContext = ReactContext;
export const manifestHyperionContext = hyperionContext;
