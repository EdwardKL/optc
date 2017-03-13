import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Panel, Pagination, Button, Well, Label, Input, ButtonInput, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import UsernameInput from '../../components/User/UsernameInput';

function ForgotPassword(props) {
  return (
    <Grid id="content">
      <Row>
        <h2>Forgot Password</h2>
        <hr />
      </Row>
      <Row>
        <Col xs={6}>
          <form action="/auth/forgotpass" method="POST">
            <UsernameInput
              help="The email associated with this account will receive a password reset token."
            />
            <br />
            <Button bsStyle="primary" type="submit">
                Request password reset
            </Button>
          </form>
        </Col>
      </Row>
    </Grid>
  );
}

export default ForgotPassword;
