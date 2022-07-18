import { EntityActions } from './reducers/entities';
import { RequestActions } from './reducers/request';
import { MappingActions } from './reducers/mapping';
import { Store } from 'redux';
import { HyperionStore } from '@hyperion-framework/types';
import { MetaActions } from './reducers/meta';

export type AllActions = MappingActions | RequestActions | EntityActions | MetaActions;

export type ReduxStore = Store<HyperionStore, AllActions>;
