import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

import styles from './styles.css'

import visual from './d3';
import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

class Visual extends Component {
  constructor(props) {
    super(props);
    this.state = {d3: undefined}
  }

  componentDidMount = () => {
    this.createVisualisation();
  }

  createVisualisation = () => {
    const data = this.props.project.file;
    data && this.setState({d3: visual(data, {
      features: undefined,
      labels: undefined,
      fieldDescriptions: undefined,
    })});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.visual}>
        <div id="wrapper">
          <Typography variant='h5'>What correlates with the outcome?</Typography>
          <div id="menu">
            {/* <h2>&uarr; Y axis</h2>
                  <ul id="y-axis-menu"></ul>
                  <h2>&rarr; X axis</h2> */}
            <ul id="x-axis-menu"></ul>
          </div>
          {this.state.d3 && <RD3Component data={this.state.d3} className={classes.d3Component}/>}
          <div id="chart" ></div>
          <Typography >This chart plots the Y against different X measures. Start by clicking the measures  above and see what trends you can identify.</Typography>
        </div>
      </div>
    )
  }
}

Visual.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  project: state.projectState,
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
  )
)(Visual);