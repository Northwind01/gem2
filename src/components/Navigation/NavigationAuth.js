import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

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

const NavigationAuth = ({ authUser, classes }) => (
  <div>
    <Button href={ROUTES.DASHBOARD} className={classes.button}>Dashboard</Button>
    <Button href={ROUTES.ACCOUNT} className={classes.button}>Account</Button>
    {!!authUser.roles[ROLES.ADMIN] && (
        <Button href={ROUTES.ADMIN} className={classes.button}>Admin</Button>
    )}
    <SignOutButton />
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});


NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
  ),
)(NavigationAuth);