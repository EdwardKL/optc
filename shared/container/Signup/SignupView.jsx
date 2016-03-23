import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class Signup extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.userInfo = {};
    this.state.error = '';
    this.state.password = '';
    this.validPassword = false;
    this.validUserName = false;
    this.validPirateLevel = false;
    this.handleInputUserName = this.handleInputUserName.bind(this);
    this.handleInputPassword =  this.handleInputPassword.bind(this);
    this.handleInputPirateLevel = this.handleInputPirateLevel.bind(this);
  }


  handleInputUserName(e){
    this.validUserName = e.target.value !== "";
    this.state.userInfo.username = e.target.value;
    this.setState({userInfo: this.state.userInfo});
    this.setState({error:''});
  }

  handleInputPassword(e){
    this.validPassword = e.target.value !== "";
    this.state.userInfo.password = e.target.value;
    this.setState({userInfo: this.state.userInfo});
  }

  handleInputPirateLevel(e) {
    this.validPirateLevel = e.target.value !== "";
    this.state.userInfo.pirate_level = e.target.value;
    this.setState({userInfo: this.state.userInfo});
  }

  render() {

    return(

      <Grid>
        <Row>
          <h2>
            Sign up
          </h2>
          <hr/>
          <Col md={12}>
            <form action="/signup" method="POST">
              <Input
                placeholder="User Name"
                onChange={this.handleInputUserName}
                label="User Name"
				name="username"
                type ="text"/>
              <br/>
              <Input
                placeholder="Enter Password"
                onChange={this.handleInputPassword}
                label="Password"
				name="password"
                type="password" />
              <br/>
              <Input
                placeholder="Pirate Level"
                onChange={this.handleInputPirateLevel}
                label="Pirate Level"
                type ="number"
				name = "pirate_level"
                min = "1"
                max = "10000" />
              <br/>
              <Button bsStyle="primary" type="submit">
                Sign up
              </Button> &nbsp; or&nbsp;
              <LinkContainer to="/signin"><a>Sign In</a></LinkContainer>
              <p>{this.state.error}</p>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default Signup;
