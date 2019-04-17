import React from 'react';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { withFirebase } from '../Firebase';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

const SignOutButton = ({ firebase, classes }) => (
  <Button onClick={firebase.doSignOut} className={classes.button}>Sign Out</Button>
);

SignOutButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withFirebase,
  withStyles(styles),
)(SignOutButton);