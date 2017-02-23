import React, { Component, PropTypes } from 'react';
import { Panel, Row, Col, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import AccountEditor from '../../components/Account/AccountEditor';
import CaptainEditor from '../../components/Captain/CaptainEditor';
import Captain from '../../components/Captain/Captain';
import { padNumber } from '../../utils';


// TODO: Maybe move this to a library.
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

class Account extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.showModal = false;
    this.state.account = props.account_data;
    this.state.edit = props.edit;
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.accountHasMaxCaptains = this.accountHasMaxCaptains.bind(this);
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  accountHasMaxCaptains() {
    const MAX_CAPTAINS = 10;
    return this.state.account._captains.length >= MAX_CAPTAINS;
  }

  render() {
    const disabledAddAccountTooltip = (
      <Tooltip id="tooltip"><strong>You can only have a maximum of 10 captains.</strong></Tooltip>
    );
    const editor = (<Col xs={1}>
      <CaptainEditor edit={false} account_id={this.state.account._id}>
        <OverlayTrigger placement="top" overlay={disabledAddAccountTooltip}>
          <Button
            bsStyle="primary"
            className="addCaptainButton"
            disabled={this.accountHasMaxCaptains()}
          >
            Add Captain
          </Button>
        </OverlayTrigger>
      </CaptainEditor>
      <Row>
        <AccountEditor
          edit
          crew_name={this.state.account.crew_name}
          friend_id={this.state.account.friend_id}
          pirate_level={this.state.account.pirate_level}
          region={this.state.account.region}
          account_id={this.state.account._id}
        />
      </Row>
      <Row>
        <Button
          bsStyle="danger"
          className="deleteAccountButton"
          onClick={this.open}
        >
          Delete
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Body>
            <h4> Are you sure you want to delete your account? </h4>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="danger"
              href={'/accounts/delete/id'.replace('id', this.state.account._id)}
            >Yes</Button>
            <Button onClick={this.close}>No</Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </Col>);
    return (
      <Panel className="accountPanel">
        <Col xs={2} className="removeLeftPadding">
          <div className="accountInfo">
            <span className="crewName">{this.state.account.crew_name}</span>
            <span className="pirateLevel">Level {this.state.account.pirate_level}</span>
            <span className="friendID">{padNumber(this.state.account.friend_id)}</span>
            <span className="region">{this.state.account.region.capitalizeFirstLetter()}</span>
          </div>
        </Col>
        <Col xs={this.state.edit ? 9 : 10}>
          {this.state.account._captains.map((captain) => {
            return <Captain edit={this.state.edit} captain_data={captain} account_id={this.state.account._id} key={captain._id} />;
          })}
        </Col>
        {this.state.edit ? editor : <div />}
      </Panel>
    );
  }
}

Account.propTypes = {
  account_data: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default Account;
