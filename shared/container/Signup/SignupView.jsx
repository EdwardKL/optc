import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import UsernameInput from '../../components/User/UsernameInput';
import PasswordInput from '../../components/User/PasswordInput';

function Signup(props) {
  return (
    <Grid id="content">
      <Row>
        <h2>Sign Up</h2>
        <hr />
      </Row>
      <Row>
        <Col xs={6} id="oauth-selection">
          <a className="btn btn-block btn-social btn-facebook" href="/auth/facebook"><span className="fa fa-facebook" />Login with Facebook</a><br /><br />
          <a className="btn btn-block btn-social btn-google" href="/auth/google"><span className="fa fa-google" />Login with Google</a><br /><br />
          <a className="btn btn-block btn-social btn-reddit" href="/auth/reddit"><span className="fa fa-reddit" />Login with Reddit</a><br /><br />
          <a className="btn btn-block btn-social btn-twitter" href="/auth/twitter"><span className="fa fa-twitter" />Login with Twitter</a><br /><br />
        </Col>
        <Col xs={6} id="signup-right">
          <form action="/signup" method="POST">
            <UsernameInput help="This name will be displayed to other users." />
            <br />
            <PasswordInput passwordHelp="Must be more than 3 characters." needsConfirmation />
            <br />
            <Button bsStyle="primary" type="submit">Sign up</Button>
          </form>
        </Col>
      </Row>
    </Grid>
  );
}

export default Signup;
