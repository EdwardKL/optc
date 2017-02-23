import React from 'react';
import { Grid, Row, Col, Input, Button } from 'react-bootstrap';
import UsernameInput from '../../components/User/UsernameInput';

class Signup extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.password = '';
    this.state.password_confirmation = '';
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.handleInputConfirmation = this.handleInputConfirmation.bind(this);
  }

  handleInputPassword(e) {
    this.setState({ password: e.target.value });
  }
  validatePassword() {
    const length = this.state.password.length;
    if (length > 8) return 'success';
    if (length > 3) return 'warning';
    if (length > 0) return 'error';
  }

  handleInputConfirmation(e) {
    this.setState({ password_confirmation: e.target.value });
  }
  validateConfirmation() {
    const length = this.state.password_confirmation.length;
    if (length == 0) return;
    if (this.state.password == this.state.password_confirmation) return 'success';
    if (length > 0) return 'error';
  }

  render() {
    return (
      <Grid id="content">
        <Row>
          <h2>
            Sign Up
          </h2>
          <hr />
        </Row>
        <Row>
          <Col xs={6} id="oauth-selection">
            <a className="btn btn-block btn-social btn-facebook" href="/auth/facebook"><span className="fa fa-facebook" />Login with Facebook</a><br /><br />
            <a className="btn btn-block btn-social btn-google" href="/auth/google"><span className="fa fa-google" />Login with Google</a><br /><br />
            <a className="btn btn-block btn-social btn-reddit" href="/auth/reddit"><span className="fa fa-reddit" />Login with Reddit</a><br /><br />
            <a className="btn btn-block btn-social btn-twitter" href="/auth/twitter"><span className="fa fa-twitter" />Login with Twitter</a><br /><br />
          </Col>
          <Col xs={6} id="signup-right">
            <form action="/signup" method="POST">
              <UsernameInput help="This name will be displayed to other users." />
              <br />
              <Input
                placeholder="Enter Password"
                onChange={this.handleInputPassword}
                bsStyle={this.validatePassword()}
                hasFeedback
                label="Password"
                name="password"
                help="Must be more than 3 characters."
                type="password"
              />
              <br />
              <Input
                placeholder="Confirm Password"
                label="Confirm Password"
                onChange={this.handleInputConfirmation}
                bsStyle={this.validateConfirmation()}
                hasFeedback
                name="password_confirmation"
                type="password"
              />
              <br />
              <Button bsStyle="primary" type="submit">
                Sign up
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Signup;
