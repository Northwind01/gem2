import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import * as ROUTES from '../../constants/routes';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const NavigationNonAuth = ({ authUser, classes }) => (
  <div>
    <Button href={ROUTES.SIGN_IN} className={classes.button}>Sign In</Button>
    <Button href={ROUTES.SIGN_UP} className={classes.button}>Sign Up</Button>
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});


NavigationNonAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
  ),
)(NavigationNonAuth);