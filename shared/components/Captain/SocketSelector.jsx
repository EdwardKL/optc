import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';

class SocketSelector extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.key = props.key_prop;
    this.state.onChange = props.onChange;
    this.state.getSocketSelections = props.getSocketSelections;
    this.state.getSelectedSocket = props.getSelectedSocket;
  }
  
  render() {
    return (
      <Row>
        <Col xs={6}>
          <Input
            placeholder="Socket Type"
            label="Socket Type"
            name="socket_types"
            type="select"
            value={this.state.getSelectedSocket(this.state.key)}
            onChange={this.state.onChange}>
            {this.state.getSocketSelections(this.state.key).map(function(socket) {
              return <option value={socket._id} key={socket._id}>{socket.name}</option>
            })}
          </Input>
        </Col>
        <Col xs={3}>
          <Input
            placeholder="Level"
            label="Socket Level"
            name="socket_levels"
            type="number"
            defaultValue="1"
            min="1"
            max="5"/>
        </Col>
      </Row>
    )
  }
}

SocketSelector.propTypes = {
  key_prop: PropTypes.number.isRequired,
  getSelectedSocket: PropTypes.func.isRequired,
  getSocketSelections: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SocketSelector;
