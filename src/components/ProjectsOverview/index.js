import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { withFirebase } from '../Firebase';
import ProjectList from './ProjectList';

import moment from 'moment';

const styles = theme => ({
  typography: {
    marginBottom: theme.spacing.unit*3,
  },
  button: {
    marginTop: theme.spacing.unit,
  },
});

class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    this.unsubscribe = this.props.firebase
      .db.collection('projects').where("userId", "==", this.props.authUser.uid)
      .onSnapshot(querySnapshot => {
        const projects = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const createdAt = moment(data.createdAt).format("MMM Do YYYY");
          const row = {
            name: data.projectInfo.name,
            client: data.projectInfo.client,
            createdAt,
            status: data.status,
            projectId: doc.id
          }
          projects.push(row)
        })
        this.props.onSetProjects(projects);
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // onCreateProject = (event, authUser) => {
  //   this.props.firebase.db.collection('projects').add({
  //     text: this.state.text,
  //     userId: authUser.uid,
  //     createdAt: '',
  //   });

  //   this.setState({ text: '' });

  //   event.preventDefault();
  // };

  // onEditProject = (project, text) => {
  //   const { uid, ...projectSnapshot } = project;

  //   this.props.firebase.db.collection('projects').doc(project.uid).set({
  //     ...projectSnapshot,
  //     text,
  //     editedAt: this.props.firebase.Timestamp,
  //   });
  // };

  // onRemoveProject = uid => {
  //   this.props.firebase.db.collection('projects').doc(uid).delete();
  // };

  onNextPage = () => {
    this.props.onSetProjectsLimit(this.props.limit + 5);
  };

  render() {
    const { projects, classes } = this.props;
    const { loading } = this.state;

    return (
      <div>
        <Typography className={classes.typography} variant='h5'>Overview of existing projects</Typography>

        {loading && <Typography className={classes.typography}>Loading ...</Typography>}

        {projects && (
          <ProjectList
            authUser={this.props.authUser}
            projects={projects}
            // onEditProject={this.onEditProject}
            // onRemoveProject={this.onRemoveProject}
          />
        )}

        {!projects && <Typography className={classes.typography}>There are no projects ...</Typography>}

        {!loading && projects && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.onNextPage}
          >
            More
        </Button>
        )}
      </div>
    );
  }
}

Projects.propTypes = {
  classes: PropTypes.object.isRequired,
};

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
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Projects);
