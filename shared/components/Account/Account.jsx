import React, {Component, PropTypes} from 'react';
import {Panel, Row, Col, Button} from 'react-bootstrap';
import AccountEditor from '../../components/Account/AccountEditor';

class Account extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.account_data = props.account_data;
  }
  
  render() {
    return (
      <Panel key={this.state.account_data.id}>
        <Col md={4}>
          <h3>{this.state.account_data.crew_name}</h3>
        </Col>
        <Col md={7}>
          <Row><b>Friend ID:</b> {this.state.account_data.friend_id}</Row>
          <Row><b>Region:</b> {this.state.account_data.region}</Row>
        </Col>
        <Col md={1}>
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
