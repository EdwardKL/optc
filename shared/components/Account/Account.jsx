import React, { Component, PropTypes } from 'react';
import { Panel, Row, Col, Button } from 'react-bootstrap';
import AccountEditor from '../../components/Account/AccountEditor';
import CaptainEditor from '../../components/Captain/CaptainEditor';
import Captain from '../../components/Captain/Captain';

// TODO: Maybe move this to a library.
String.prototype.capitalizeFirstLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

class Account extends Component {
  constructor(props, context) {
    console.log('calling account constructor');
    super(props, context);
    this.state = {};
    this.state.account = props.account_data;
    this.state.edit = props.edit;
  }

  render() {
    const editor = (<Col xs={1}>
      <CaptainEditor edit={false} account_id={this.state.account._id}>
        <Button bsStyle="primary" className="addCaptainButton">Add Captain</Button>
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
        <Button bsStyle="danger" className="deleteAccountButton" href={'/accounts/delete/id'.replace('id', this.state.account._id)}>
          Delete
        </Button>
      </Row>
    </Col>);
    return (
      <Panel className="accountPanel">
        <Col xs={2} className="removeLeftPadding">
          <div className="accountInfo">
            <span className="crewName">{this.state.account.crew_name}</span>
            <span className="pirateLevel">Level {this.state.account.pirate_level}</span>
            <span className="friendID">{this.state.account.friend_id}</span>
            <span className="region">{this.state.account.region.capitalizeFirstLetter()}</span>
          </div>
        </Col>
        <Col xs={this.state.edit ? 9 : 10}>
          {this.state.account._captains.map((captain) => {
            return <Captain edit={this.state.edit} captain_data={captain} account_id={this.state.account._id} key={captain._id}/>;
          })}
        </Col>
        {this.state.edit ? editor : <div/>}
      </Panel>
    );
  }
}

Account.propTypes = {
  account_data: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
};

export default Account;
