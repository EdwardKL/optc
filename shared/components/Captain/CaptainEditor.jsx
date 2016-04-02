import React, {Component, PropTypes} from 'react';
import {Modal, Input, Row, Col, Button} from 'react-bootstrap';
import UnitSelector from '../Captain/UnitSelector';

class CaptainEditor extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.showModal = false;
    this.state.edit = props.edit;
    this.state.title = this.state.edit ? "Edit Captain" : "Add Captain";
    this.state.link_type = "link";
    this.state.action_name = this.state.edit ? "Edit" : "Add";
    /*
    this.state.account_id = this.state.edit ? props.account_id : -1;
    this.state.default_crew_name = this.state.edit ? props.crew_name : "";
    this.state.default_friend_id = this.state.edit ? props.friend_id : '';
    this.state.default_region = this.state.edit ? props.region : "global";*/
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
        <Button bsStyle="primary" onClick={this.open} bsStyle={this.state.link_type}>{this.state.title}</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form action="/captains/add" method="POST">
                  <Row>
                      <Col md={12}>
                      <UnitSelector/>
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

CaptainEditor.propTypes = {
  edit: PropTypes.bool.isRequired,
};

export default CaptainEditor;
