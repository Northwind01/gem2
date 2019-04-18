const INITIAL_STATE = {};

const saveProjectInfo = (state, projectInfo) => ({
  ...state,
  projectInfo
});

const saveProjectData = (state, projectData) => ({
  ...state,
  projectData
});

const saveAnalysisOptions = (state, analysisOptions) => ({
  ...state,
  analysisOptions
});

function projectReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVE_PROJECT_INFO': {
      return saveProjectInfo(state, action.projectInfo);
    }
    case 'SAVE_PROJECT_DATA': {
      return saveProjectData(state, action.projectData);
    }
    case 'SAVE_ANLYSIS_OPTIONS': {
      return saveAnalysisOptions(state, action.analysisOptions);
    }
    default:
      return state;
  }
}

export default projectReducer;
