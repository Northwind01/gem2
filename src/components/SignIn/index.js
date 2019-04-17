import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import { SignUpLink } from '../SignUp';
import SignInGoogle from './SignInGoogle';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import styles from '../styles/signForms';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
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
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input 
                name="password" 
                type="password" 
                id="password" 
                autoComplete="current-password"
                value={password}
                onChange={this.onChange}
                placeholder="Password" />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
            >
              Sign in
            </Button>

            {error && <p>{error.message}</p>}
          </form>
          <SignInGoogle />
          <PasswordForgetLink />
          <SignUpLink />
        </Paper>
      </main>
    );
  }
}

SignInFormBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SignInForm = compose(
  withRouter,
  withFirebase,
  withStyles(styles),
)(SignInFormBase);

export default SignInForm;

export { SignInForm, SignInGoogle };
