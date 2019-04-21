import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';
import ProgressBar from './ProgressBar';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit*3,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

function getSteps() {
  return ['Identify your project', 'Upload the data', 'Specify the analysis options'];
}

class VerticalLinearStepper extends Component {
  state = {
    activeStep: 0,
    uploadingProgress: 0
  };

  handleNext = () => {
    if (this.state.activeStep === 2) {
      setTimeout(() => {
        this.onCreateProject(this.props.authUser)
      }, 500);
    };

    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  onCreateProject = (authUser) => {
    const project = {
      input: this.props.project,
      userId: authUser.uid,
      createdAt: Date.now(),
      status: 'open',
      output: {
        dataFields: {
          features: [],
          labels: [],
          //fieldDescriptions: {},
        },
        visuals: [
          {
            visual: 'coo1'
          },
        ]
      }
    };
    const file = project.input.projectData.FILE;
    delete project.input.projectData.FILE;

    this.props.firebase.db.collection('projects').add(project)
      .then((docRef)=>{
        this.props.saveProjectInfo({id: docRef.id});

        const path = 'projectFiles/' + docRef.id + '.csv';
        const url = this.props.firebase.storage.ref().child(path);
        const fileUpload = url.put(file);
        fileUpload.on('state_changed', snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.setState({ uploadingProgress: progress });
          console.log('Upload is ' + progress + 'done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, error => {
          //handle error
        }, () => {
          //handle success
          fileUpload.snapshot.ref.getDownloadURL()
            .then((downloadURL)=>docRef.update({file: downloadURL}))
        })
      })
      .catch((error)=>console.error('Error creating the project: ', error));
  };

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Form1/>;
      case 1:
        return <Form2/>
      case 2:
        return <Form3/>
      default:
        return 'Unknown step';
    }
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant='h5'>Submit new project</Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <div>{this.getStepContent(index)}</div>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} className={classes.resetContainer}>
            <Typography >All steps completed - you have submitted the project and are uploading the data</Typography>
            <ProgressBar uploadingProgress={this.state.uploadingProgress}/>
            <Button onClick={this.handleReset} className={classes.button}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  project: state.projectState
});

const mapDispatchToProps = dispatch => ({
  saveProjectInfo: projectInfo => 
    dispatch({ type: 'SAVE_PROJECT_INFO', projectInfo }),
});

export default compose(
  withFirebase,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(VerticalLinearStepper);