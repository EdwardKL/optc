import React, { Component, PropTypes } from 'react';
import { Modal, Input, Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';

class UnitSelector extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.default_unit_id = props.default_unit_id ? props.default_unit_id : 1;
    this.state.unit_selections = props.unit_selections;
    this.state.onChange = props.onChange;

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event) {
      this.setState({default_unit_id : event.value});
      this.state.onChange(event);
    } else {
      this.setState({default_unit_id : ''});
    }
  }

  render() {
    let options = [];
    for (let i = 0; i < this.state.unit_selections.length; i++) {
      options.push({ value: this.state.unit_selections[i]._id, label: this.state.unit_selections[i].name});
    }

    return (
      <Row>
      <Select name="unit_id"
              options={options}
              value={this.state.default_unit_id}
              onChange={this.handleChange}
              className="captainEditorSelector">
      </Select>
      </Row>
    );
  }
}
UnitSelector.propTypes = {
  default_unit_id: PropTypes.number,
  unit_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UnitSelector;
