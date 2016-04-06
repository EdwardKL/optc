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
    this.state.account_id = props.account_id;
    this.state.captain_id = props.captain_id;
    this.state.edit = props.edit;
    this.state.label = this.state.edit ? "Edit" : "Add Captain";
    this.state.title = this.state.edit ? "Edit Captain" : "Add Captain";
    this.state.link_type = "link";
    this.state.action_name = this.state.edit ? "Edit" : "Add";
    this.state.unit_selections = props.unit_selections;
    this.state.socket_selections = props.socket_selections;
    this.state.level_value = this.state.edit ? props.default_level : 1;
    this.state.special_value = this.state.edit ? props.default_special : 1;
    this.state.current_sockets = {};
    this.state.num_sockets = this.state.edit ? props.default_sockets.length : 0;
    this.state.default_socket_levels = {};
    for (var index in props.default_sockets) {
      this.state.current_sockets[index] = props.default_sockets[index]._socket;
      this.state.default_socket_levels[index] = props.default_sockets[index].socket_level;
    }
    this.state.unit = this.state.edit ? this.state.unit_selections[props.unit_id - 1] : this.state.unit_selections[0];
    this.state.default_unit_id = this.state.edit ? props.unit_id : 1;
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
    this.getSocketLevel = this.getSocketLevel.bind(this);
    this.state.children = props.children;
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
      result = this.getSocketSelections(key)[0]._id;
    }
    return result;
  }
  
  getSocketLevel(key) {
    if (key in this.state.default_socket_levels) {
      return this.state.default_socket_levels[key];
    }
    return 1;
  }
  
  render() {
    return (
      <div className="captainEditor">
        {React.cloneElement(this.state.children, { onClick: this.open })}
        <Modal show={this.state.showModal} onHide={this.close}>
            <form action="/captains/add" method="POST">
              <Modal.Header closeButton>
                  <Modal.Title>{this.state.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                    <Row>
                        <Col md={12}>
                          <UnitSelector
                            unit_selections={this.state.unit_selections}
                            onChange={this.unitSelected}
                            default_unit_id={this.state.default_unit_id} />
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
                    <Row>
                        <Col md={3}>
                          <Input
                            placeholder="HP CCs"
                            label="HP CCs"
                            name="current_hp_ccs"
                            type="number"
                            defaultValue="0"
                            min="0"
                            max="100"/>
                        </Col>
                        <Col md={3}>
                          <Input
                            placeholder="ATK CCs"
                            label="ATK CCs"
                            name="current_atk_ccs"
                            type="number"
                            defaultValue="0"
                            min="0"
                            max="100"/>
                        </Col>
                        <Col md={3}>
                          <Input
                            placeholder="RCV CCs"
                            label="RCV CCs"
                            name="current_rcv_ccs"
                            type="number"
                            defaultValue="0"
                            min="0"
                            max="100"/>
                        </Col>
                    </Row>
                    {_.times(this.state.num_sockets, i =>
                      // We want to pass the key to SocketSelector, but "key" is a reserved keyword, so we use "key_prop".
                      <SocketSelector
                        key={i}
                        key_prop={i}
                        getSocketSelections={this.getSocketSelections}
                        getSelectedSocket={this.getSelectedSocket}
                        default_level={this.getSocketLevel(i)}
                        onChange={this.socketChanged.bind(this, i)}
                      />
                    )}
                    <input type="hidden" name="account_id" value={this.state.account_id} />
                    <input type="hidden" name="captain_id" value={this.state.captain_id} />
                    <Button bsStyle="default" onClick={this.addSocket} disabled={this.addSocketDisabled()}>Add Socket</Button>&nbsp;
                    <Button bsStyle="default" onClick={this.removeSocket} disabled={this.removeSocketDisabled()}>Remove Socket</Button>
              </Modal.Body>
              <Modal.Footer>
                  {this.state.edit ? <Button bsStyle="danger" className="deleteCaptainButton" type="button" href={"/captains/delete/" + this.state.account_id + "/" + this.state.captain_id}>Delete</Button> : <div/>}
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
  account_id: PropTypes.number.isRequired,
  edit: PropTypes.bool.isRequired,
  unit_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  socket_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  default_sockets: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps)(CaptainEditor);
