const INITIAL_STATE = {
  projects: null,
  limit: 5,
};

const applySetProjects = (state, action) => ({
  ...state,
  projects: action.projects,
});

const applySetProjectsLimit = (state, action) => ({
  ...state,
  limit: action.limit,
});

function projectsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'PROJECTS_SET': {
      return applySetProjects(state, action);
    }
    case 'PROJECTS_LIMIT_SET': {
      return applySetProjectsLimit(state, action);
    }
    default:
      return state;
  }
}

export default projectsReducer;
