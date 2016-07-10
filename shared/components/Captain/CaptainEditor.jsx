import React, { Component, PropTypes } from 'react';
import { Modal, Input, Row, Col, Button } from 'react-bootstrap';
import UnitSelector from '../Captain/UnitSelector';
import SocketSelections from '../Captain/SocketSelections';
import { connect } from 'react-redux';

export class CaptainEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.showModal = props.showModal;
    this.state.account_id = props.account_id;
    this.state.captain_id = props.captain_id;
    this.state.edit = props.edit;
    this.state.label = this.state.edit ? 'Edit' : 'Add Captain';
    this.state.title = this.state.edit ? 'Edit Captain' : 'Add Captain';
    this.state.link_type = 'link';
    this.state.action_name = this.state.edit ? 'Edit' : 'Add';
    this.state.unit_selections = props.unit_selections;
    this.state.level_value = this.state.edit ? props.default_level : 1;
    this.state.special_value = this.state.edit ? props.default_special : 1;
    this.state.unit = this.state.edit ? this.state.unit_selections[props.unit_id - 1] : this.state.unit_selections[0];
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.getMaxLevel = this.getMaxLevel.bind(this);
    this.getMaxSpecial = this.getMaxSpecial.bind(this);
    this.unitSelected = this.unitSelected.bind(this);
    this.handleLevelChange = this.handleLevelChange.bind(this);
    this.getLevelValue = this.getLevelValue.bind(this);
    this.handleSpecialChange = this.handleSpecialChange.bind(this);
    this.getSpecialValue = this.getSpecialValue.bind(this);
    this.state.children = props.children;

    // Used to force child component updates when rerendering.
    this.key = 0;
    this.getKey = () => {
      this.key += 1;
      return this.key;
    };

    // For SocketSelections.
    this.state.default_sockets = props.default_sockets;
    this.state.socket_selections = props.socket_selections;
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

  unitSelected(e) {
    const unit = this.state.unit_selections[e.target.value - 1];
    this.setState({ unit });
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
                            key={this.getKey()}
                            unit_selections={this.state.unit_selections}
                            onChange={this.unitSelected}
                            default_unit_id={this.state.unit._id} />
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
                            min={this.getMaxSpecial() > 0 ? "1" : "0"}
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
                    <SocketSelections
                      key={this.getKey()}
                      default_sockets={this.state.default_sockets}
                      socket_selections={this.state.socket_selections}
                      max_sockets={this.state.unit.max_sockets}
                    />
                    <input type="hidden" name="account_id" value={this.state.account_id} />
                    <input type="hidden" name="captain_id" value={this.state.captain_id} />
              </Modal.Body>
              <Modal.Footer>
                  {this.state.edit ? <Button bsStyle="danger" className="deleteCaptainButton" type="button" href={'/captains/delete/' + this.state.account_id + '/' + this.state.captain_id}>Delete</Button> : <div/>}
                  <Button bsStyle="primary" type="submit">{this.state.action_name}</Button>
                  <Button onClick={this.close}>Cancel</Button>
              </Modal.Footer>
            </form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    unit_selections: store.identity.unit_selections,
    socket_selections: store.identity.socket_selections,
  };
}

CaptainEditor.propTypes = {
  account_id: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  unit_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  socket_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  default_sockets: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps)(CaptainEditor);
