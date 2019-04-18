import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 15,
  },
  menu: {
    width: 200,
  },
});

class Form3 extends React.Component {
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  componentWillUnmount = async () => {
    await this.props.saveAnalysisOptions(this.state);
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container}>
        <TextField
          id="analysis-options"
          label="Analysis options"
          defaultValue={this.props.analysis}
          onChange={this.handleChange('analysis')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
        />
      </form>
    );
  }
}

Form3.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  ...state.projectState.analysisOptions
});

const mapDispatchToProps = dispatch => ({
  saveAnalysisOptions: analysisOptions => 
    dispatch({ type: 'SAVE_ANLYSIS_OPTIONS', analysisOptions }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Form3));