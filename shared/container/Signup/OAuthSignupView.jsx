import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class OAuthSignup extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.username = '';
    this.handleInputUserName = this.handleInputUserName.bind(this);
  }

  handleInputUserName(e){
    this.setState({username: e.target.value});
  }
  validateUserName() {
    var length = this.state.username.length;
    if (length > 1) return 'success';
    if (length > 0) return 'error';
  }
  
  render() {
    return(
      <Grid id="content">
        <Row>
          <h2>
            Set User Name
          </h2>
          <hr/>
        </Row>
        <Row>
          <Col xs={5}>
            <form action="/auth/oauth-signup" method="POST">
              <Input
                placeholder="User Name"
                onChange={this.handleInputUserName}
                bsStyle={this.validateUserName()}
                hasFeedback
                label="User Name"
                name="username"
                help="This name will be displayed to other users."
                type="text"/>
              <br/>
              <Button bsStyle="primary" type="submit">
                Set
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default OAuthSignup;
