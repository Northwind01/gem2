import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import visual from './d3';
import rd3 from 'react-d3-library';
const RD3Component = rd3.Component;

const styles = {
}

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
    return (
      <div id="visual">
        <div id="wrapper">
          {this.state.d3 && <RD3Component data={this.state.d3} />}
          <div id="chart"></div>
          <div id="title"><h1>What story does your data tell?</h1></div>
          <div id="about">
              <h4>About</h4>
              <p><strong>Is there a connection between X and Y?</strong></p>
              <p>This scatterplot plots the Y against X different measures. Start by clicking the measures  above and see what trends you can identify.</p>
          </div>
          <div id="menu">
            {/* <h2>&uarr; Y axis</h2>
                  <ul id="y-axis-menu"></ul>
                  <h2>&rarr; X axis</h2> */}
            <ul id="x-axis-menu"></ul>
          </div>
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