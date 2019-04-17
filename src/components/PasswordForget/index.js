import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import styles from '../styles/signForms';

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === '';

    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset password
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email address</InputLabel>
              <Input 
                id="email" 
                name="email" 
                autoComplete="email" 
                autoFocus
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email address" />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
            >
              Reset password
            </Button>

            {error && <p>{error.message}</p>}
          </form>
        </Paper>
      </main>
    );
  }
}

PasswordForgetFormBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot password?</Link>
  </p>
);

const PasswordForgetForm = compose(
  withFirebase,
  withStyles(styles),
)(PasswordForgetFormBase);

export default PasswordForgetForm;

export { PasswordForgetForm, PasswordForgetLink };
