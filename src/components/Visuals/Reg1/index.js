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
    this.state = {
      visualId: 'reg1',
      d3: undefined,
      visualDetails: {}
    }
  }

  componentDidMount = () => {
    this.getVisualisationDetails();
    this.createVisualisation();
  }

  getVisualisationDetails = () => {
    const projectVisuals = this.props.project.output.visuals;
    const visualDetails = projectVisuals.filter(el => el.visual === this.state.visualId)[0];
    this.setState({visualDetails});
  }

  createVisualisation = () => {
    const data = this.props.project.file;
    const dataFields = this.props.project.output.dataFields;
    data && this.setState({d3: visual(data, dataFields)});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.visual}>
        <div id="wrapper">
          <Typography 
            gutterBottom={true}  
            variant="h5">
              {this.state.visualDetails.title || 'What features correlate with the outcome?'}
          </Typography>
          <Typography>
            {this.state.visualDetails.comments || 'This chart plots outcomes (y axis) against different features (x axis). Start by clicking the features below and see what trends you can identify.'}
          </Typography>
          <div id="menu">
            {/* <h2>&uarr; Y axis</h2>
                  <ul id="y-axis-menu"></ul>
                  <h2>&rarr; X axis</h2> */}
            <ul id="x-axis-menu"></ul>
          </div>
          {this.state.d3 && <RD3Component data={this.state.d3} className={classes.d3Component}/>}
          <div id="chart" ></div>
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