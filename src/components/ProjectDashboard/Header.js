import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Visuals from '../Visuals';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
});

function TabContainer(props) {
  return (
    <Typography 
      component="div" 
      style={{ padding: 8 * 3 }}
      color="textSecondary"
      align="center"
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      visuals: this.props.project.output.visuals
    };
  }

  handleChange = (event, value) => this.setState({ value });

  createTabLables = () => {
    const tabLabels = [];
    const projectVisuals = this.props.project.output.visuals;
    projectVisuals.forEach((el, i) => {
      tabLabels.push(<Tab textColor="inherit" label={el.tabName || `Visual ${i+1}`} />)
    })
    return tabLabels
  }

  createTab = (value) => {
    const projectVisuals = this.props.project.output.visuals;
    const visualId = projectVisuals[value]['visual'];
    return <TabContainer>{Visuals[visualId]}</TabContainer>
  }

  render() {
    const { classes, onDrawerToggle, project } = this.props;
    const { value } = this.state;

    return (
      <React.Fragment>
        {/* <AppBar color="primary" position="sticky" elevation={0}>
          <Toolbar>
            <Grid container spacing={8} alignItems="center">
              <Hidden smUp>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={onDrawerToggle}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
              </Hidden>
              <Grid item xs />
            </Grid>
          </Toolbar>
        </AppBar> */}
        <AppBar
          component="div"
          className={classes.secondaryBar}
          color="primary"
          position="static"
          elevation={0}
        >
          <Toolbar>
            <Grid container alignItems="center" spacing={8}>
              <Grid item xs>
                <Typography color="inherit" variant="h5">
                  Visualisations
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <AppBar
          component="div"
          className={classes.secondaryBar}
          color="primary"
          position="static"
          elevation={0}
        >
          <Tabs value={value} textColor="inherit" onChange={this.handleChange}>
            {this.createTabLables()}
          </Tabs>
        </AppBar>
        {this.createTab(value)}
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);