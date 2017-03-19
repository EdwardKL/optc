import React, { Component, PropTypes } from 'react';
import Input from '../Input';

class UsernameInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.username = '';
    this.handleInputUserName = this.handleInputUserName.bind(this);
  }

  handleInputUserName(e) {
    this.setState({ username: e.target.value });
  }

  validateUserName() {
    const length = this.state.username.length;
    if (length > 0) {
      if (length > 1 && /^[a-zA-Z\-_0-9]+$/.test(this.state.username)) {
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
        label={this.props.labeled ? 'User Name' : null}
        name="username"
        onChange={this.handleInputUserName}
        placeholder="User Name"
        validator={this.validateUserName()}
      />
    );
  }
}

UsernameInput.defaultProps = {
  labeled: true,
};

UsernameInput.propTypes = {
  help: PropTypes.string,
  bsSize: PropTypes.string,
  labeled: PropTypes.bool,
};

export default UsernameInput;
