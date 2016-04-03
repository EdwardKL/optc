import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';

class AccountEditor extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.showModal = false;
    this.state.edit = props.edit;
    this.state.account_id = this.state.edit ? props.account_id : -1;
    this.state.label = this.state.edit ? "Edit" : "Add Account";
    this.state.title = this.state.edit ? "Edit Account" : "Add Account";
    this.state.link_type = this.state.edit ? "link" : "primary";
    this.state.action_name = this.state.edit ? "Edit" : "Add";
    this.state.default_crew_name = this.state.edit ? props.crew_name : "";
    this.state.default_friend_id = this.state.edit ? props.friend_id : '';
    this.state.default_pirate_level = this.state.edit ? props.pirate_level : 1;
    this.state.default_region = this.state.edit ? props.region : "global";
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
        <Button bsStyle="primary" onClick={this.open} bsStyle={this.state.link_type}>{this.state.label}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <form action="/accounts/add" method="POST">
            <Modal.Header closeButton>
                <Modal.Title>{this.state.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                  <Col xs={12}>
                    <Input
                      placeholder="Crew Name"
                      label="Crew Name"
                      name="crew_name"
                      help="Helps others make sure they added the right account"
                      defaultValue={this.state.default_crew_name}
                      type="text"/>
                  </Col>
                </Row>
                <Row>
                  <Col xs={3}>
                    <Input
                      placeholder="Friend ID"
                      label="Friend ID"
                      name="friend_id"
                      type="number"
                      defaultValue={this.state.default_friend_id}
                      min="100000000"
                      max="999999999"/>
                  </Col>
                  <Col xs={3}>
                    <Input
                      placeholder="Pirate Level"
                      label="Pirate Level"
                      name="pirate_level"
                      type="number"
                      defaultValue={this.state.default_pirate_level}
                      min="1"/>
                  </Col>
                  <Col xs={3}>
                    <Input type="select" label="Region" placeholder="global" defaultValue={this.state.default_region} name="region">
                      <option value="global">Global</option>
                      <option value="japan">Japan</option>
                    </Input>
                    <input type="hidden" name="id" value={this.state.account_id} />
                  </Col>
                </Row>
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

AccountEditor.propTypes = {
  edit: PropTypes.bool.isRequired,
  crew_name: PropTypes.string,
  friend_id: PropTypes.number,
  region: PropTypes.string,
  account_id: PropTypes.number,
};

export default AccountEditor;
