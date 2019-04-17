import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  }
});

class UploadButton extends React.Component {
  
  handleselectedFile = (e) => this.props.onSelectFile(e.target.files[0]);

  render() {
    const { classes } = this.props;

    return (
      <div>
        <input
          accept="*"
          className={classes.input}
          id="contained-button-file"
          multiple
          type="file"
          onChange={this.handleselectedFile}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="secondary" component="span" className={classes.button}>
            Upload data (csv)
          </Button>
        </label>
      </div>
    );
  };
};

UploadButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadButton);