import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Button, ButtonInput, Modal, Panel, Input} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Account from '../../components/Account/Account';

class AccountView extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.user = props.user;
    this.state.showModal = false;
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
    return(
      <Grid>
        <Row>
          <h2>
          {this.state.user.username}'s Accounts
          </h2>
        </Row>
        <Row>
            {this.state.user.accounts.map(function(account) {
              return <Account account_data={account} key={account.id}/>;
            })}
            <Button bsStyle="primary" onClick={this.open} type="button">Add Account</Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form action="/accounts/add" method="POST">
                      <Row>
                          <Col md={12}>
                          <Input
                            placeholder="Crew Name"
                            label="Crew Name"
                            name="crew_name"
                            help="Helps others make sure they added the right account"
                            type="text"/>
                          </Col>
                      </Row>
                      <Row>
                          <Col md={3}>
                          <Input
                            placeholder="Friend ID"
                            label="Friend ID"
                            name="friend_id"
                            type="number"
                            min="100000000"
                            max="999999999"/>
                          </Col>
                          <Col md={3}>
                          <Input type="select" label="Region" placeholder="global" name="region">
                            <option value="global">Global</option>
                            <option value="japan">Japan</option>
                          </Input>
                          </Col>
                      </Row>
                      <Button bsStyle="primary" type="submit">Add</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.close}>Cancel</Button>
                </Modal.Footer>
            </Modal>
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
