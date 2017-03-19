import React, { Component, PropTypes } from 'react';
import Input from '../Input';

class EmailInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.email = '';
    this.handleInputEmail = this.handleInputEmail.bind(this);
  }

  handleInputEmail(e) {
    this.setState({ email: e.target.value });
  }

  validateEmail() {
    const length = this.state.email.length;
    if (length > 0) {
      if (length > 1 && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.state.email)) {
        return 'success';
      }
      return 'error';
    }
    return null;
  }

  render() {
    return (
      <Input
        bsSize={this.props.bsSize}
        help={this.props.help}
        label="Email"
        name="email"
        onChange={this.handleInputEmail}
        placeholder="Email"
        validator={this.validateEmail()}
        type="email"
      />
    );
  }
}

EmailInput.propTypes = {
  help: PropTypes.string,
  bsSize: PropTypes.string,
};

export default EmailInput;
