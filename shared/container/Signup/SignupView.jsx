import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Signup extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.error = '';
    this.state.username = '';
    this.state.password = '';
    this.state.password_confirmation = '';
    this.handleInputUserName = this.handleInputUserName.bind(this);
    this.handleInputPassword =  this.handleInputPassword.bind(this);
    this.handleInputConfirmation =  this.handleInputConfirmation.bind(this);
    this.handleInputPirateLevel = this.handleInputPirateLevel.bind(this);
  }

  handleInputUserName(e){
    this.setState({username: e.target.value});
  }
  validateUserName() {
    var length = this.state.username.length;
    if (length > 2) return 'success';
    if (length > 0) return 'error';
  }

  handleInputPassword(e){
    this.setState({password: e.target.value});
  }
  validatePassword() {
    var length = this.state.password.length;
    if (length > 8) return 'success';
    if (length > 4) return 'warning';
    if (length > 0) return 'error';
  }
  
  handleInputConfirmation(e){
    this.setState({password_confirmation: e.target.value});
  }
  validateConfirmation() {
    var length = this.state.password_confirmation.length;
    if (length == 0) return;
    if (this.state.password == this.state.password_confirmation) {
        return 'success';
    }
    if (length > 0) return 'error';
  }

  handleInputPirateLevel(e) {
    this.validPirateLevel = e.target.value !== "";
    this.state.userInfo.pirate_level = e.target.value;
    this.setState({userInfo: this.state.userInfo});
  }

  render() {

    return(
      <Grid>
        <Row>
          <h2>
            Sign up
          </h2>
        </Row>
        <Row>
          <Col md={6}>
            <a href="/auth/google">Login with Google</a><br /><br />
            <a href="/auth/facebook">Login with Facebook</a><br /><br />
            <a href="/auth/reddit">Login with Reddit</a><br /><br />
            <a href="/auth/twitter">Login with Twitter</a><br /><br />
          </Col>
          <Col md={6}>
            <form action="/signup" method="POST">
              <Input
                placeholder="User Name"
                onChange={this.handleInputUserName}
                bsStyle={this.validateUserName()}
                hasFeedback
                label="User Name"
                name="username"
                type="text"/>
              <br/>
              <Input
                placeholder="Enter Password"
                onChange={this.handleInputPassword}
                bsStyle={this.validatePassword()}
                hasFeedback
                label="Password"
                name="password"
                type="password" />
              <br/>
              <Input
                placeholder="Confirm Password"
                label="Confirm Password"
                onChange={this.handleInputConfirmation}
                bsStyle={this.validateConfirmation()}
                hasFeedback
                name="password_confirmation"
                type="password" />
              <br/>
              <Button bsStyle="primary" type="submit">
                Sign up
              </Button> &nbsp; or&nbsp;
              <LinkContainer to="/signin"><a>Sign In</a></LinkContainer>
              <p>{this.state.error}</p>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default Signup;
