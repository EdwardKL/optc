import React, { PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { Grid, Row } from 'react-bootstrap';
import { connect } from 'react-redux';
import Account from '../../components/Account/Account';
import AccountEditor from '../../components/Account/AccountEditor';
import PasswordEditor from '../../components/Account/PasswordEditor';
import UserDeleter from '../../components/Account/UserDeleter';

class AccountView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.user = props.user;
    this.state.edit = props.logged_in_user && props.logged_in_user._id === this.state.user._id;
  }

  render() {
    const editor = (<div>
      <Row>{ this.state.user.is_local ? <PasswordEditor /> : <div/> }</Row>
      <Row> <UserDeleter /> </Row>
    </div>);
    return (
      <Grid id="content">
          <Row>
            <h2>
            {`${this.state.user.display_name}'s Accounts`}
            </h2>
            <hr/>
          </Row>
          {this.state.edit ? editor : <div/>}
          <Row>
            {this.state.user._accounts.map((account) => {
              return <Account edit={this.state.edit} account_data={account} key={account._id}/>;
            })}
            {this.state.edit ? <AccountEditor edit={false} /> : <div/>}
          </Row>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    logged_in_user: store.identity.user,
    user: store.account.user,
  };
}

AccountView.need = [(params) => {
  return Actions.fetchAccounts(params.username);
}];

AccountView.propTypes = {
  user: PropTypes.object.isRequired,
  logged_in_user: PropTypes.object,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(AccountView);
