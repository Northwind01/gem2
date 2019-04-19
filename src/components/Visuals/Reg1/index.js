import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import createVisualisation from './d3';

const styles = {
}

class Visual extends Component {
  constructor(props) {
    super(props);
    this.state = {d3: undefined}
  }

  componentDidMount() {
    createVisualisation(this.node, this.props.project.file);
  }

  componentDidUpdate() {
    createVisualisation(this.node, this.props.project.file);
  }

  render() {
    return (
      {this.node && <svg ref={node => this.node = node}
      width={500} height={500}>
      </svg>}
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