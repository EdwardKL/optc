import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Panel, Pagination, Button, Well, Label, Input, ButtonInput, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class ForgotPassword extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.username = '';
    this.state.password = '';
    this.state.password_confirmation = '';
    this.handleInputUserName = this.handleInputUserName.bind(this);
    this.handleInputPassword = this.handleInputPassword.bind(this);
    this.handleInputConfirmation = this.handleInputConfirmation.bind(this);
  }

  handleInputUserName(e) {
    this.setState({ username: e.target.value });
  }
  validateUserName() {
    const length = this.state.username.length;
    if (this.state.username.length > 0) {
      if (length > 1 && /^[a-zA-Z\-_0-9]+$/.test(this.state.username)) return 'success';
      return 'error';
    }
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
            Forgot Password
          </h2>
          <hr />
        </Row>
        <Row>
          <Col xs={6}>
            <form action="/forgotpass" method="POST">
              <Input
                placeholder="User Name"
                onChange={this.handleInputUserName}
                bsStyle={this.validateUserName()}
                hasFeedback
                label="User Name"
                name="username"
                help="The email associated with this account will receive a password reset token."
                type="text"
              />
              <br />
              <Button bsStyle="primary" type="submit">
                Request password reset
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default ForgotPassword;
