import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Button, ButtonInput, Modal, Input} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';

class Account extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.username = props.user.username;
    this.state.showModal = false;
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }
  
  close(e) {
    this.setState({ showModal: false });
  }

  open(e) {
    console.log("open");
    this.setState({ showModal: true });
  }

  render() {
    return(
      <Grid>
        <Row>
          <h2>
          {this.state.username}'s Accounts
          </h2>
        </Row>
        <Row>
            <Button bsStyle="primary" onClick={this.open} type="button">Add Account</Button>
        </Row>
      </Grid>
    )
  }
}

function mapStateToProps(store) {
  console.log("mapping state to props using store: ", store);
  return {
    user: store.user,
  };
}

Account.propTypes = {
  user: PropTypes.object.isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Account);
