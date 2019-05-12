import { Epic } from 'redux-observable';
import requestEpic from './requestEpic';
import offlineRequestEpic from "./offlineRequestEpic";

const epics: Epic[] = [requestEpic, offlineRequestEpic];

export default epics;
