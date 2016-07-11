import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';

class UserDeleter extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.showModal = false;
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close(e) {
    this.setState({ showModal: false });
  }

  open(e) {
    this.setState({ showModal: true });
  }

  render() {
    return (
      <div>
        <Button onClick={this.open} bsStyle="danger">Delete User</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <form action="/auth/delete" method="POST">
            <Modal.Header>
             <Modal.Title>Are you sure? You won't be able to undo this.</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              <Button bsStyle="danger" type="submit">Nuke it!</Button>
              <Button onClick={this.close}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    )
  }
}

export default UserDeleter;
