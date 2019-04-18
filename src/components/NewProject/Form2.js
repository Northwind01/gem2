import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import UploadButton from './UploadButton';

const styles = theme => ({
  container: {
    display: 'block',
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

class Form2 extends React.Component {
  handleChange = name => event => {
    const arr = event.target.value.split(', ');
    this.setState({ [name]: arr });
  };

  handleSelectedFile = file => this.setState({FILE: file});

  componentWillUnmount = () => {
    this.props.saveProjectData(this.state);
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container}>
        <UploadButton onSelectFile={this.handleSelectedFile}/>
        <TextField
          id="listFeatureColumns"
          label="List feature columns"
          multiline
          rowsMax="4"
          defaultValue={this.props.features}
          onChange={this.handleChange('features')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
          helperText="e.g.: product, color, sale_date"
        />
        <TextField
          id="listLabelColumns"
          label="List label columns"
          multiline
          rowsMax="4"
          defaultValue={this.props.labels}
          onChange={this.handleChange('labels')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
          helperText="e.g.: price"
        />
      </form>
    );
  }
}

Form2.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  ...state.projectState.projectData
});

const mapDispatchToProps = dispatch => ({
  saveProjectData: projectData => 
    dispatch({ type: 'SAVE_PROJECT_DATA', projectData }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Form2));