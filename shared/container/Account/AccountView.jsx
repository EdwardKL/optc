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
    console.log('user: ', this.state.user);
  }

  render() {
    return (
      <Grid id="content">
          <Row>
            <h2>
            {`${this.state.user.display_name}'s Accounts`}
            </h2>
            <hr/>
          </Row>
          <Row> { this.state.user.is_local ? <PasswordEditor /> : <div/> } </Row>
          <Row> <UserDeleter /> </Row>
          <Row>
            {this.state.user._accounts.map((account) => {
              return <Account account_data={account} key={account._id}/>;
            })}
            <AccountEditor edit={false} />
          </Row>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  console.log('mapping state to props: ', store.account);
  return {
    user: store.account.user,
  };
}

AccountView.need = [(params) => {
  return Actions.fetchAccounts(params.username);
}];

AccountView.propTypes = {
  user: PropTypes.object.isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(AccountView);
