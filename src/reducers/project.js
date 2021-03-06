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

const applySetProject = (state, project) => ({
  ...project,
});

const readFile = (state, file) => ({
  ...state,
  fileRead: file,
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
    case 'PROJECT_SET': {
      return applySetProject(state, action.project);
    }
    case 'READ_FILE': {
      return readFile(state, action.file);
    }
    default:
      return state;
  }
}

export default projectReducer;
