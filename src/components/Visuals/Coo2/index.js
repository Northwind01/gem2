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
      visualId: 'coo2',
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
    data && this.setState({d3: visual(data, {
      container: '#chart-container',
      start_color: 'white',
      end_color: '#9b0000'
    })});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.visual}>
        <div id="wrapper">
          <Typography 
            gutterBottom={true} 
            variant="h5">
              {this.state.visualDetails.title || 'Co-occurrence matrix '}
          </Typography>
          <Typography 
            align="left">
              {/* {this.state.visualDetails.comments || 'This matrix diagram visualizes items co-occurrences. Each colored cell represents two items that appeared in the same data structure; darker cells indicate items that co-occurred more frequently. Use the drop-down menu to reorder the matrix and explore the data.'} */}
          </Typography>
          {/* <div>
            <p>Order: <select id="order">
              <option value="name">by name</option>
              <option value="count">by frequency</option>
              <option value="group">by cluster</option>
            </select>
            </p>
          </div> */}
          {this.state.d3 && <RD3Component data={this.state.d3} className={classes.d3Component}/>}
          <div id="chart-container" ></div>
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