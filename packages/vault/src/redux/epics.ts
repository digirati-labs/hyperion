import { Epic } from 'redux-observable';
import requestEpic from './requestEpic';

const epics: Epic[] = [requestEpic];

export default epics;
