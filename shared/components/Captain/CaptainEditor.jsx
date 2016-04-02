import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';
import UnitSelector from '../Captain/UnitSelector';
import { connect } from 'react-redux';

class CaptainEditor extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.showModal = false;
    this.state.edit = props.edit;
    this.state.title = this.state.edit ? "Edit Captain" : "Add Captain";
    this.state.link_type = "link";
    this.state.action_name = this.state.edit ? "Edit" : "Add";
    this.state.unit_selections = props.unit_selections;
    this.state.level_value = this.state.edit ? props.default_level : 1;
    this.state.special_value = this.state.edit ? props.default_special : 1;
    this.state.unit = this.state.edit ? this.state.unit_selections[props.unit_id] : this.state.unit_selections[0];
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.getMaxLevel = this.getMaxLevel.bind(this);
    this.getMaxSpecial = this.getMaxSpecial.bind(this);
    this.getMaxSockets = this.getMaxSockets.bind(this);
    this.unitSelected = this.unitSelected.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.getLevelValue = this.getLevelValue.bind(this);
    this.handleSpecialChange = this.handleSpecialChange.bind(this);
    this.getSpecialValue = this.getSpecialValue.bind(this);
  }
  
  close(e) {
    this.setState({ showModal: false });
  }

  open(e) {
    this.setState({ showModal: true });
  }
  
  getMaxLevel() {
    return this.state.unit.max_level;
  }
  
  getMaxSpecial() {
    return this.state.unit.max_special_level;
  }
  
  getMaxSockets() {
    return this.state.unit.max_sockets;
  }
  
  unitSelected(e) {
    this.setState({ unit_id: e.target.value,
                    unit: this.state.unit_selections[e.target.value - 1] });
  }
  
  handleLevelChange(e) {
    this.setState({ level_value: e.target.value });
  }
  getLevelValue() {
    return Math.min(this.state.level_value, this.getMaxLevel());
  }
  
  handleSpecialChange(e) {
    this.setState({ special_value: e.target.value });
  }
  getSpecialValue() {
    return Math.min(this.state.special_value, this.getMaxSpecial());
  }
  
  render() {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.open} bsStyle={this.state.link_type}>{this.state.title}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="/captains/add" method="POST">
                  <Row>
                      <Col md={12}>
                        <UnitSelector unit_selections={this.state.unit_selections} onChange={this.unitSelected} />
                      </Col>
                  </Row>
                  <Row>
                      <Col md={3}>
                        <Input
                          placeholder="Level"
                          label="Level"
                          name="current_level"
                          type="number"
                          onChange={this.handleLevelChange}
                          value={this.getLevelValue()}
                          min="1"
                          max={this.getMaxLevel()}/>
                      </Col>
                      <Col md={3}>
                        <Input
                          placeholder="Special Level"
                          label="Special Level"
                          name="current_special_level"
                          type="number"
                          onChange={this.handleSpecialChange}
                          value={this.getSpecialValue()}
                          min="1"
                          max={this.getMaxSpecial()}/>
                      </Col>
                  </Row>
                  <Button bsStyle="primary" type="submit">{this.state.action_name}</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Cancel</Button>
            </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    unit_selections: store.unit_selections,
  };
}

CaptainEditor.propTypes = {
  edit: PropTypes.bool.isRequired,
  unit_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(CaptainEditor);
