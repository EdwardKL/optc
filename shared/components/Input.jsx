import React, { Component, PropTypes } from 'react';
import { ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap';

class Input extends Component {
  maybeGetLabel() {
    if (!this.props.label) return null;
    return <ControlLabel>{this.props.label}</ControlLabel>;
  }

  maybeGetHelpText() {
    if (!this.props.help) return null;
    return <HelpBlock>{this.props.help}</HelpBlock>;
  }

  render() {
    return (
      <FormGroup
        controlId={this.props.name}
        validationState={this.props.validator}
        bsSize={this.props.bsSize}
      >
        {this.maybeGetLabel()}
        <FormControl
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          type={this.props.type}
          name={this.props.name}
        />
        {this.maybeGetHelpText()}
        <FormControl.Feedback />
      </FormGroup>
    );
  }
}

Input.defaultProps = {
  type: 'text',
};

Input.propTypes = {
  bsSize: PropTypes.string,
  help: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  validator: PropTypes.func,
};

export default Input;
