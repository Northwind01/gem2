import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import { Grid, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import VisualSpace from './VisualSpace';

const styles = {
  Paper: { 
      padding: 20, 
      margin: 5,
      height: '75vh',
      overflow: 'auto' }
}

class Project extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.setState({ loading: true, id });
    this.onListenForProject(id);
  }

  onListenForProject = (id) => {
    this.unsubscribe = this.props.firebase
      .db.collection('projects').doc(id)
      .onSnapshot(doc => {
        this.props.onSetProject(doc.data());
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { project } = this.props;
    const { loading } = this.state;

    return (
      <div>
      {loading && <Typography >Loading ...</Typography>}

      {project && (
        <Grid container spacing={0}>
          <Grid item sm>
            <Paper style={styles.Paper}>
              <VisualSpace
                authUser={this.props.authUser}
                project={project}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {!project && <Typography >There is no such projects ...</Typography>}
    </div>
    );
  }
}

Project.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  project: state.projectsState
});

const mapDispatchToProps = dispatch => ({
  onSetProject: project =>
    dispatch({ type: 'PROJECT_SET', project }),
});

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
  withFirebase,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )
)(Project);
