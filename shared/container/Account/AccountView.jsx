import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Button, ButtonInput, Panel, Modal, Input} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Account from '../../components/Account/Account';
import AccountEditor from '../../components/Account/AccountEditor';
import PasswordEditor from '../../components/Account/PasswordEditor';

class AccountView extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.user = props.user;
  }

  render() {
    return(
      <Grid>
        <Row>
          { this.state.user.is_local ? <PasswordEditor /> : <div/> }
        </Row>
        <Row>
          <h2>
          {this.state.user.username}'s Accounts
          </h2>
        </Row>
        <Row>
          {this.state.user.accounts.map(function(account) {
            return <Account account_data={account} key={account.id}/>;
          })}
          <AccountEditor edit={false} />
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(store) {
  return {
    user: store.user,
  };
}

AccountView.propTypes = {
  user: PropTypes.object.isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(AccountView);
