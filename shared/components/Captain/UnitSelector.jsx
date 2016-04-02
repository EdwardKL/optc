import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';

class UnitSelector extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.default_unit_id = 1;
    if (typeof props.default_unit_id != 'undefined') {
      this.state.default_unit_id = props.default_unit_id;
    }
    this.state.unit_selections = props.unit_selections;
    this.state.onChange = props.onChange;
  }
  
  render() {
    return (
      <Input type="select" label="Unit" placeholder="global" defaultValue={this.state.default_unit_id} onChange={this.state.onChange} name="unit_id" required>
        {this.state.unit_selections.map(function(unit) {
          return <option value={unit.id} key={unit.id}>{String(unit.id) + ". " + unit.name}</option>
         })}
      </Input>
    )
  }
}
UnitSelector.propTypes = {
  default_unit_id: PropTypes.number,
  unit_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default UnitSelector;
