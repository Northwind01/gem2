import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import projectsReducer from './projects';
import projectReducer from './project';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  projectsState: projectsReducer,
  projectState: projectReducer,
});

export default rootReducer;
