import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import ProjectList from './ProjectList';

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
    };
  }

  componentDidMount() {
    if (!this.props.projects.length) {
      this.setState({ loading: true });
    }

    this.onListenForProjects();
  }

  componentDidUpdate(props) {
    if (props.limit !== this.props.limit) {
      this.onListenForProjects();
    }
  }

  onListenForProjects = () => {
    this.props.firebase
      .projects()
      .orderByChild('createdAt')
      .limitToLast(this.props.limit)
      .on('value', snapshot => {
        this.props.onSetProjects(snapshot.val());

        this.setState({ loading: false });
      });
  };

  componentWillUnmount() {
    this.props.firebase.projects().off();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateProject = (event, authUser) => {
    this.props.firebase.db.collection('projects').add({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: '',
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  onEditProject = (project, text) => {
    const { uid, ...projectSnapshot } = project;

    this.props.firebase.db.collection('projects').doc(project.uid).set({
      ...projectSnapshot,
      text,
      editedAt: this.props.firebase.Timestamp,
    });
  };

  onRemoveProject = uid => {
    this.props.firebase.db.collection('projects').doc(uid).delete();
  };

  onNextPage = () => {
    this.props.onSetProjectsLimit(this.props.limit + 5);
  };

  render() {
    const { projects } = this.props;
    const { text, loading } = this.state;

    return (
      <div>
        {!loading && projects && (
          <button type="button" onClick={this.onNextPage}>
            More
          </button>
        )}

        {loading && <div>Loading ...</div>}

        {projects && (
          <ProjectList
            authUser={this.props.authUser}
            projects={projects}
            onEditProject={this.onEditProject}
            onRemoveProject={this.onRemoveProject}
          />
        )}

        {!projects && <div>There are no projects ...</div>}

        <form
          onSubmit={event =>
            this.onCreateProject(event, this.props.authUser)
          }
        >
          <input
            type="text"
            value={text}
            onChange={this.onChangeText}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  projects: Object.keys(state.projectsState.projects || {}).map(
    key => ({
      ...state.projectsState.projects[key],
      uid: key,
    }),
  ),
  limit: state.projectsState.limit,
});

const mapDispatchToProps = dispatch => ({
  onSetProjects: projects =>
    dispatch({ type: 'PROJECTS_SET', projects }),
  onSetProjectsLimit: limit =>
    dispatch({ type: 'PROJECTS_LIMIT_SET', limit }),
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Projects);
