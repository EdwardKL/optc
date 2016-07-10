// Provides a form to specify socket types and their associated levels.
// Note that this must be enclosed in a form tag.

import _ from 'lodash';
import SocketSelector from '../Captain/SocketSelector';
import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

export class SocketSelections extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.max_sockets = props.max_sockets;
    this.state.socket_selections = props.socket_selections;
    this.state.current_sockets = [];
    this.state.default_socket_levels = [];
    this.state.next_selector_key = 0;

    this.getSelectorKey = () => {
      this.state.next_selector_key += 1;
      return this.state.next_selector_key;
    };

    this.getNumSockets = () => {
      return this.state.current_sockets.length;
    };

    this.getMaxSockets = () => {
      return this.state.max_sockets;
    };

    this.isAddSocketDisabled = () => {
      return this.getNumSockets() >= this.getMaxSockets();
    };

    this.isRemoveSocketDisabled = () => {
      return this.getNumSockets() <= 0;
    };

    for (var index in props.default_sockets) {
      if (this.isAddSocketDisabled()) break;
      this.state.current_sockets.push(props.default_sockets[index]._socket);
      this.state.default_socket_levels.push(props.default_sockets[index].socket_level);
    }

    this.addSocket = () => {
      this.state.current_sockets.push(this.getFirstAvailableSocket());
      this.setState({});
    };

    this.removeSocket = () => {
      this.state.current_sockets.pop();
      this.setState({});
    };

    this.isSocketSelected = (socket) => {
      return this.state.current_sockets.indexOf(socket._id) !== -1;
    };

    this.getFirstAvailableSocket = () => {
      for (const index in this.state.socket_selections) {
        const socket = this.state.socket_selections[index];
        if (this.isSocketSelected(socket)) continue;
        return socket._id;
      }
      return -1;
    };

    // A socket selector should only be able to select sockets that haven't
    // been selected by other selectors.
    this.getSocketSelections = (key) => {
      // All selected sockets expect for the one selected by the selector in question.
      const selected_sockets = this.state.current_sockets.filter((socket) => {
        return socket !== this.state.current_sockets[key];
      });
      const selections = this.state.socket_selections.filter((socket) => {
        return selected_sockets.indexOf(socket._id) === -1;
      });
      return selections;
    };

    this.getSelectedSocket = (key) => {
      let result = 0;
      if (key in this.state.current_sockets) {
        result = this.state.current_sockets[key];
      } else {
        result = this.getFirstAvailableSocket();
      }
      return result;
    };

    this.getSocketLevel = (key) => {
      if (key in this.state.default_socket_levels) {
        return this.state.default_socket_levels[key];
      }
      return 1;
    };

    this.socketChanged = (key, e) => {
      this.state.current_sockets[key] = Number(e.target.value);
      this.setState({});
    };
  }

  render() {
    return (
      <div className="socketSelections">
        {_.times(this.getNumSockets(), i =>
          // We cannot reuse keys across renders, because React will try to be
          // a smartass and skip child reconstruction if it thinks it should
          // (it shouldn't and it should feel bad).
          <SocketSelector
            key={this.getSelectorKey()}
            key_prop={i}
            default_level={this.getSocketLevel(i)}
            default_value={this.getSelectedSocket(i)}
            socket_selections={this.getSocketSelections(i)}
            onChange={this.socketChanged.bind(this, i)}
          />
        )}
        <Button
          className="addSocket"
          bsStyle="default"
          onClick={this.addSocket}
          disabled={this.isAddSocketDisabled()}
        >
          Add Socket
        </Button>&nbsp;
        <Button
          className="removeSocket"
          bsStyle="default"
          onClick={this.removeSocket}
          disabled={this.isRemoveSocketDisabled()}
        >
          Remove Socket
        </Button>
      </div>
    );
  }
}

SocketSelections.propTypes = {
  default_sockets: PropTypes.arrayOf(PropTypes.object),
  socket_selections: PropTypes.arrayOf(PropTypes.object).isRequired,
  max_sockets: PropTypes.number.isRequired,
};

export default SocketSelections;
