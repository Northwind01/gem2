import React, { Component } from 'react';
import { Grid, Paper } from '@material-ui/core';
import NewProject from '../NewProject';
//import ProjectsOverview from '../ProjectsOverview';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';

const styles = {
  Paper: { 
      padding: 20, 
      margin: 5,
      height: '75vh',
      overflow: 'auto' }
}

class Dashboard extends Component {
  render() {
    return (
        <Grid container spacing={0}>
            <Grid item sm>
                <Paper style={styles.Paper}>
                    <NewProject/>
                </Paper>
            </Grid>
            <Grid item sm>
                <Paper style={styles.Paper}>
                    {/* <ProjectsOverview/> */}
                </Paper>
            </Grid>
        </Grid>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(Dashboard);
