import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit*3,
  },
});

class LinearBuffer extends React.Component {
//   state = {
//     completed: this.props.uploadingProgress,
//     buffer: 10,
//   };

//   componentDidMount() {
//     this.timer = setInterval(this.progress, 500);
//   }

//   componentWillUnmount() {
//     clearInterval(this.timer);
//   }

//   progress = () => {
//     const { completed } = this.state;
//     if (completed > 100) {
//       this.setState({ completed: 0, buffer: 10 });
//     } else {
//       const diff = Math.random() * 10;
//       const diff2 = Math.random() * 10;
//       this.setState({ completed: completed + diff, buffer: completed + diff + diff2 });
//     }
//   };

  render() {
    const { classes } = this.props;
    const buffer = 10;
    return (
      <div className={classes.root}>
        <LinearProgress color="secondary" variant="buffer" value={this.props.uploadingProgress} valueBuffer={buffer} />
      </div>
    );
  }
}

LinearBuffer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearBuffer);