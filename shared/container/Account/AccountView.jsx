import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Account extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.username = props.user.username;
  }

  render() {
    return(
      <Grid>
        <Row>
          <h2>
            Accounts
          </h2>
        </Row>
        <Row>
          Welcome, {this.state.username}!
        </Row>
      </Grid>
    )
  }
}

export default Account;
