import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';
import UnitSelector from '../Captain/UnitSelector';
import SocketSelector from '../Captain/SocketSelector';
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
    this.state.socket_selections = props.socket_selections;
    this.state.level_value = this.state.edit ? props.default_level : 1;
    this.state.special_value = this.state.edit ? props.default_special : 1;
    // TODO: support editing for sockets
    this.state.current_sockets = {};
    this.state.num_sockets = 0;
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
    this.addSocket = this.addSocket.bind(this);
    this.addSocketDisabled = this.addSocketDisabled.bind(this);
    this.removeSocket = this.removeSocket.bind(this);
    this.removeSocketDisabled = this.removeSocketDisabled.bind(this);
    this.getSocketSelections = this.getSocketSelections.bind(this);
    this.getSelectedSocket = this.getSelectedSocket.bind(this);
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
    var unit = this.state.unit_selections[e.target.value - 1];
    while (unit.max_sockets < this.state.num_sockets) {
      this.state.num_sockets -=1;
      delete this.state.current_sockets[this.state.num_sockets];
    }
    this.setState({ unit_id: e.target.value,
                    unit: unit });
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
  
  addSocket() {
    var new_id = this.state.num_sockets;
    var sockets = this.state.current_sockets;
    sockets[new_id] = this.getSocketSelections(new_id)[0]._id;
    this.setState({ num_sockets: this.state.num_sockets + 1,
                    current_sockets: sockets });
  }
  addSocketDisabled() {
    return this.state.num_sockets >= this.getMaxSockets();
  }
  
  removeSocket() {
    delete this.state.current_sockets[this.state.num_sockets - 1];
    this.setState({ num_sockets: this.state.num_sockets - 1 });
  }
  removeSocketDisabled() {
    console.log(this.state.num_sockets);
    return this.state.num_sockets <= 0;
  }

  socketChanged(key, e) {
    var sockets = this.state.current_sockets;
    sockets[key] = e.target.value;
    this.setState({ current_sockets: sockets });
  }
  
  getSocketSelections(key) {
    // Copy the object so we don't modify the state.
    var result = JSON.parse(JSON.stringify(this.state.socket_selections));
    for (var selector_key in this.state.current_sockets) {
      // Skip the one this component selected.
      if (key == selector_key) continue;
      // Remove the ones the other components selected.
      for (var j in result) {
        if (result[j]._id == this.state.current_sockets[selector_key]) {
          result.splice(j, 1);
          break;
        }
      }
    }
    return result;
  }
  
  getSelectedSocket(key) {
    var result = 0;
    if (key in this.state.current_sockets) {
      result = this.state.current_sockets[key];
    } else {
      result = getSocketSelections(key)[0]._id;
    }
    return result;
  }
  
  render() {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.open} bsStyle={this.state.link_type}>{this.state.title}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
            <form action="/captains/add" method="POST">
              <Modal.Header closeButton>
                  <Modal.Title>{this.state.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
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
                    {_.times(this.state.num_sockets, i =>
                      <SocketSelector key={i} key_prop={i} getSocketSelections={this.getSocketSelections} getSelectedSocket={this.getSelectedSocket} onChange={this.socketChanged.bind(this, i)}/>
                    )}
                    <Button bsStyle="default" onClick={this.addSocket} disabled={this.addSocketDisabled()}>Add Socket</Button>&nbsp;
                    <Button bsStyle="default" onClick={this.removeSocket} disabled={this.removeSocketDisabled()}>Remove Socket</Button>
              </Modal.Body>
              <Modal.Footer>
                  <Button bsStyle="primary" type="submit">{this.state.action_name}</Button>
                  <Button onClick={this.close}>Cancel</Button>
              </Modal.Footer>
            </form>
        </Modal>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    unit_selections: store.unit_selections,
    socket_selections: store.socket_selections,
  };
}

CaptainEditor.propTypes = {
  edit: PropTypes.bool.isRequired,
  unit_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  socket_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(CaptainEditor);
