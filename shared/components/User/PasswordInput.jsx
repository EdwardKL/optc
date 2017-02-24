import React, { Component, PropTypes } from 'react';
import Input from '../Input';

class PasswordInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.password = '';
    this.state.confirmation = '';
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
    return null;
  }

  handleInputConfirmation(e) {
    this.setState({ confirmation: e.target.value });
  }

  validateConfirmation() {
    const length = this.state.confirmation.length;
    if (length === 0) return null;
    if (this.state.password === this.state.confirmation) return 'success';
    if (length > 0) return 'error';
    return null;
  }

  // Only returns confirmation input if requested.
  maybeGetConfirmation() {
    if (!this.props.needsConfirmation) return null;
    return (
      <div>
        <br />
        <Input
          bsSize={this.props.bsSize}
          help={this.props.passwordHelp}
          label={this.props.labeled ? 'Confirm Password' : null}
          name="password_confirmation"
          onChange={this.handleInputConfirmation}
          placeholder="Confirm Password"
          type="password"
          validator={this.validateConfirmation()}
        />
      </div>);
  }

  render() {
    return (
      <span>
        <Input
          bsSize={this.props.bsSize}
          help={this.props.passwordHelp}
          label={this.props.labeled ? 'Password' : null}
          name="password"
          onChange={this.handleInputPassword}
          placeholder="Password"
          type="password"
          validator={this.validatePassword()}
        />
        {this.maybeGetConfirmation()}
      </span>
    );
  }
}

PasswordInput.defaultProps = {
  labeled: true,
};

PasswordInput.propTypes = {
  passwordHelp: PropTypes.string.isRequired,
  bsSize: PropTypes.string,
  needsConfirmation: PropTypes.bool.isRequired,
  labeled: PropTypes.bool,
};

export default PasswordInput;
