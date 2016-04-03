import React, {Component, PropTypes} from 'react';
import {Panel, Row, Col, Button} from 'react-bootstrap';
import AccountEditor from '../../components/Account/AccountEditor';
import CaptainEditor from '../../components/Captain/CaptainEditor';
import Captain from '../../components/Captain/Captain';

// TODO: Maybe move this to a library.
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class Account extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.account_data = props.account_data;
  }
  
  render() {
    return (
      <Panel key={this.state.account_data.id}>
        <Col xs={4}>
          <h3>{this.state.account_data.crew_name}</h3>
        </Col>
        <Col xs={7}>
          <Row><b>Friend ID:</b>{this.state.account_data.friend_id}</Row>
          <Row><b>Region:</b>{this.state.account_data.region.capitalizeFirstLetter()}</Row>
          {this.state.account_data._captains.map(function(captain) {
            return <Captain captain_data={captain} account_id={this.state.account_data.id}/>
          }.bind(this))}
          <CaptainEditor edit={false} account_id={this.state.account_data.id}/>
        </Col>
        <Col xs={1}>
          <Row><AccountEditor edit={true} crew_name={this.state.account_data.crew_name} friend_id={this.state.account_data.friend_id} region={this.state.account_data.region} account_id={this.state.account_data.id}/></Row>
          <Row><a href={"/accounts/delete/id".replace("id",this.state.account_data.id)}>Delete</a></Row>
        </Col>
      </Panel>
    )
  }
}

Account.propTypes = {
  account_data: PropTypes.object.isRequired,
};

export default Account;
