import React from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import EmailInput from '../../components/User/EmailInput';

function SetEmail(props) {
  return (
    <Grid id="content">
      <Row>
        <h2>Set Email</h2>
        <hr />
      </Row>
      <Row>
        <Col xs={6}>
          <form action="/auth/set-email" method="POST">
            <EmailInput
              help="Only used to reset your password if requested."
            />
            <br />
            <Button bsStyle="primary" type="submit">
                Set Email
            </Button>
          </form>
        </Col>
      </Row>
    </Grid>
  );
}

export default SetEmail;
