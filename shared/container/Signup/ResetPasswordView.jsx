import React from 'react';
import { Grid, Row, Col, Button, Input } from 'react-bootstrap';
import UsernameInput from '../../components/User/UsernameInput';
import PasswordInput from '../../components/User/PasswordInput';

function ResetPasswordView(props) {
  return (
    <Grid id="content">
      <Row>
        <h2>Reset Password</h2>
        <hr />
      </Row>
      <Row>
        <Col xs={6}>
          <form action="/auth/resetpass" method="POST">
            <UsernameInput help="Your username." />
            <Input
              type="text"
              help="The reset password token we sent to your email."
              label="Reset Password Token"
              name="token"
              placeholder="Reset Password Token"
            />
            <PasswordInput passwordHelp="Must be more than 3 characters." needsConfirmation />
            <br />
            <Button bsStyle="primary" type="submit">Reset Password</Button>
          </form>
        </Col>
      </Row>
    </Grid>
  );
}

export default ResetPasswordView;
