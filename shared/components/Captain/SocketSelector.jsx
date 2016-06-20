// Provides a row of inputs to specify the type and level of a socket.

import React, { Component, PropTypes } from 'react';
import { Input, Row, Col } from 'react-bootstrap';

class SocketSelector extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.key = props.key_prop;
    this.state.onChange = props.onChange;
    this.state.socket_selections = props.socket_selections;
    this.state.default_level = props.default_level;
    this.state.default_value = props.default_value;
  }

  render() {
    return (
      <Row className="socketSelector">
        <Col xs={6}>
          <Input
            placeholder="Socket Type"
            label="Socket Type"
            name="socket_types"
            type="select"
            defaultValue={this.state.default_value}
            onChange={this.state.onChange}
          >
            {this.state.socket_selections.map((socket) => {
              return (<option value={socket._id} key={socket._id}>
                        {socket.name}
                      </option>);
            })}
          </Input>
        </Col>
        <Col xs={3}>
          <Input
            placeholder="Level"
            label="Socket Level"
            name="socket_levels"
            type="number"
            defaultValue={this.state.default_level}
            min="1"
            max="5"
          />
        </Col>
      </Row>
    );
  }
}

SocketSelector.propTypes = {
  key_prop: PropTypes.number.isRequired,
  socket_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  default_level: PropTypes.number.isRequired,
  default_value: PropTypes.number.isRequired,
};

export default SocketSelector;
