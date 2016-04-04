import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Signup extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.username = '';
    this.state.password = '';
    this.state.password_confirmation = '';
    this.handleInputUserName = this.handleInputUserName.bind(this);
    this.handleInputPassword =  this.handleInputPassword.bind(this);
    this.handleInputConfirmation =  this.handleInputConfirmation.bind(this);
  }

  handleInputUserName(e){
    this.setState({username: e.target.value});
  }
  validateUserName() {
    var length = this.state.username.length;
    if (this.state.username.length > 0) {
      if (length > 1 && /^[a-zA-Z\-_0-9]+$/.test(this.state.username)) return 'success';
      return 'error';
    }
  }

  handleInputPassword(e){
    this.setState({password: e.target.value});
  }
  validatePassword() {
    var length = this.state.password.length;
    if (length > 8) return 'success';
    if (length > 3) return 'warning';
    if (length > 0) return 'error';
  }
  
  handleInputConfirmation(e){
    this.setState({password_confirmation: e.target.value});
  }
  validateConfirmation() {
    var length = this.state.password_confirmation.length;
    if (length == 0) return;
    if (this.state.password == this.state.password_confirmation) return 'success';
    if (length > 0) return 'error';
  }
  
  render() {
    return(
      <Grid id="content">
        <Row>
          <h2>
            Sign Up
          </h2>
          <hr/>
        </Row>
        <Row>
          <Col xs={5}>
            <a className="btn btn-block btn-social btn-facebook" href="/auth/facebook"><span className="fa fa-facebook"></span>Login with Facebook</a><br /><br />
            <a className="btn btn-block btn-social btn-google" href="/auth/google"><span className="fa fa-google"></span>Login with Google</a><br /><br />
            <a className="btn btn-block btn-social btn-reddit" href="/auth/reddit"><span className="fa fa-reddit"></span>Login with Reddit</a><br /><br />
            <a className="btn btn-block btn-social btn-twitter" href="/auth/twitter"><span className="fa fa-twitter"></span>Login with Twitter</a><br /><br />
          </Col>
          <Col xs={6} xsOffset={1}>
            <form action="/signup" method="POST">
              <Input
                placeholder="User Name"
                onChange={this.handleInputUserName}
                bsStyle={this.validateUserName()}
                hasFeedback
                label="User Name"
                name="username"
                help="This name will be displayed to other users."
                type="text"/>
              <br/>
              <Input
                placeholder="Enter Password"
                onChange={this.handleInputPassword}
                bsStyle={this.validatePassword()}
                hasFeedback
                label="Password"
                name="password"
                help="Must be more than 3 characters."
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
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Signup;
