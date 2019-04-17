import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import styles from '../styles/signForms';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';
    
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Full name</InputLabel>
              <Input 
                id="username" 
                name="username" 
                autoComplete="username" 
                autoFocus
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full name" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email address</InputLabel>
              <Input 
                id="email" 
                name="email" 
                autoComplete="email" 
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email address" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwordOne">Password</InputLabel>
              <Input 
                name="passwordOne" 
                type="password" 
                id="passwordOne" 
                value={passwordOne}
                onChange={this.onChange}
                placeholder="Password" />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwordTwo">Confirm password</InputLabel>
              <Input 
                name="passwordTwo" 
                type="password" 
                id="passwordTwo" 
                value={passwordTwo}
                onChange={this.onChange}
                placeholder="Confirm Password" />
            </FormControl>
            <FormControlLabel
              control={<Checkbox 
                value="admin" 
                color="primary" 
                name="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={this.onChangeCheckbox}
                 />}
              label="Admin"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isInvalid}
            >
              Sign up
            </Button>

            {error && <p>{error.message}</p>}
          </form>
        </Paper>
      </main>
    );
  }
}

SignUpFormBase.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
  withStyles(styles),
)(SignUpFormBase);

export default SignUpForm;

export { SignUpForm, SignUpLink };
