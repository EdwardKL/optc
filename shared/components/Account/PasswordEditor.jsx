import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';

class PasswordEditor extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.showModal = false;
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.state.password = '';
    this.state.password_confirmation = '';
    this.handleInputPassword =  this.handleInputPassword.bind(this);
    this.handleInputConfirmation =  this.handleInputConfirmation.bind(this);
  }

  close(e) {
    this.setState({ showModal: false });
  }

  open(e) {
    this.setState({ showModal: true });
  }

  handleInputPassword(e){
    this.setState({password: e.target.value});
  }
  validatePassword() {
    var length = this.state.password.length;
    if (length > 8) return 'success';
    if (length > 3) return 'warning';
    if (length > 0) return 'error';
  }

  handleInputConfirmation(e){
    this.setState({password_confirmation: e.target.value});
  }
  validateConfirmation() {
    var length = this.state.password_confirmation.length;
    if (length == 0) return;
    if (this.state.password == this.state.password_confirmation) return 'success';
    if (length > 0) return 'error';
  }

  render() {
    return (
      <div>
        <Button className="editPasswordButton" onClick={this.open}>Edit Password</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <form action="/auth/editpass" method="POST">
            <Modal.Header closeButton>
                <Modal.Title>Edit Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Input
                placeholder="Enter Current Password"
                label="Current Password"
                name="current_password"
                type="password" />
              <br/>
              <Input
                placeholder="Enter New Password"
                onChange={this.handleInputPassword}
                bsStyle={this.validatePassword()}
                hasFeedback
                label="New Password"
                help="Must be more than 3 characters."
                name="password"
                type="password" />
              <br/>
              <Input
                placeholder="Confirm Password"
                label="Confirm Password"
                onChange={this.handleInputConfirmation}
                bsStyle={this.validateConfirmation()}
                hasFeedback
                name="password_confirmation"
                type="password" />
              <br/>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" type="submit">Edit</Button>
              <Button onClick={this.close}>Cancel</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    )
  }
}

export default PasswordEditor;
