import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';

class UnitSelector extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.default_unit_id = 1;
    if (typeof props.default_unit_id != 'undefined') {
      this.state.default_unit_id = props.default_unit_id;
    }
    this.state.unit_selections = props.unit_selections;
  }
  
  render() {
    return (
      <Input type="select" label="Unit" placeholder="global" defaultValue={this.state.default_unit_id} name="unit_id" required>
        {this.state.unit_selections.map(function(unit) {
          return <option value={unit.id}>{String(unit.id) + ". " + unit.name}</option>
         })}
      </Input>
    )
  }
}

UnitSelector.need = [() => { return Actions.fetchUnits(); }];

function mapStateToProps(store) {
  return {
    unit_selections: store.unit_selections,
  };
}

UnitSelector.propTypes = {
  default_unit_id: PropTypes.number,
  units: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps)(UnitSelector);
