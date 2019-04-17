import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class Footer extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Dashboard" containerElement={<Link to={ROUTES.LANDING}/>}/>
          <Tab label="About"/>
          <Tab label="Instructions"/>
        </Tabs>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
    authUser: state.sessionState.authUser,
  });

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
    withStyles(styles),
    connect(
      mapStateToProps,
    ),
  )(Footer);