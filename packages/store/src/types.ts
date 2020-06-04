import { EntityActions } from './reducers/entities';
import { RequestActions } from './reducers/request';
import { MappingActions } from './reducers/mapping';
import { Store } from 'redux';
import { HyperionStore } from '@hyperion-framework/types';

export type AllActions = MappingActions | RequestActions | EntityActions;

export type ReduxStore = Store<HyperionStore, AllActions>;
