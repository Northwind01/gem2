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

class Form1 extends React.Component {
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  componentWillUnmount = () => {
    this.props.saveProjectInfo(this.state);
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container}>
        <TextField
          id="project-name"
          label="Project name"
          defaultValue={this.props.name}
          onChange={this.handleChange('name')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
          required
        />
        <TextField
          id="client-name"
          label="Client name"
          defaultValue={this.props.client}
          onChange={this.handleChange('client')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
          required
          //helperText="Is it an external or internal client?"
        />
        <TextField
          id="description"
          label="Description"
          multiline
          rowsMax="4"
          defaultValue={this.props.description}
          onChange={this.handleChange('description')}
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
        />
        <TextField
          id="due-date"
          label="Due date"
          type="date"
          defaultValue={this.props.dueDate}
          onChange={this.handleChange('dueDate')}
          className={classNames(classes.textField, classes.dense)}
          InputLabelProps={{
            shrink: true,
            }}
        />
        <TextField
          id="budget"
          label="Budget estimate"
          defaultValue={this.props.budget}
          onChange={this.handleChange('budget')}
          type="number"
          className={classNames(classes.textField, classes.dense)}
          margin="dense"
          //helperText="Estimate the budget"
        />
      </form>
    );
  }
}

Form1.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  ...state.projectState.projectInfo
});

const mapDispatchToProps = dispatch => ({
  saveProjectInfo: projectInfo => 
    dispatch({ type: 'SAVE_PROJECT_INFO', projectInfo }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Form1));