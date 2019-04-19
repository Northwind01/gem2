import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

import styles from './style.css';

import rd3 from 'react-d3-library';
import node from './d3';
import * as d3_lib from 'd3';
const RD3Component = rd3.Component;

class Reg1 extends Component {
    constructor(props) {
        super(props);
        this.state = {d3: undefined}
    }
    
    componentDidMount = () => {
        const url = this.props.project.file;
        const data = d3_lib.csv(url);
        this.setState({d3: node(data)});
    }
    
    render() {
        return (
            <div id="wmuh">
                <div id="wrapper">
                    {this.state.d3 && <RD3Component data={this.state.d3} />}
                    <div id="chart"></div>

                    <div id="title">
                        <h1>What story does your data tell?</h1>
                    </div>

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
        );
    }
}

const mapStateToProps = state => ({
    project: state.projectState
  });

export default compose(
    withStyles(styles),
    connect(
      mapStateToProps
    ),
  )(Reg1);