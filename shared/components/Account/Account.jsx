import React, {Component, PropTypes} from 'react';
import {Panel} from 'react-bootstrap';

class Account extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.account_data = props.account_data;
  }
  
  render() {
    return (
      <Panel key={this.state.account_data.id}>
        <h3>{this.state.account_data.crew_name}</h3>
        <b>Friend ID:</b> {this.state.account_data.friend_id}<br />
        <b>Region:</b> {this.state.account_data.region}<br />
      </Panel>
    )
  }
}

Account.propTypes = {
  account_data: PropTypes.object.isRequired,
};

export default Account;
