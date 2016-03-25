import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import auth from '../../../services/authentication';

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
    this.formSubmit = this.formSubmit.bind(this);
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

  formSubmit(e) {
    alert("Submitting form");

    e.preventDefault();
    if(!this.validUserName){
      this.setState({error : 'Please Input the User Name'});
      alert("invalid user");
    }
    else if(!this.validPassword){
      this.setState({error : 'Please input password.'});
    }
    else if(!this.validPirateLevel) {
      this.setState({error : 'Please input pirate level.'})
    }
    else{
      alert("signing up");
      var newUser = this.state.userInfo;
      auth.signup(newUser);
    }
  }

  render() {
    hello = function(e) {
      alert("HELLO");
      e.preventDefault();
    }

    return(
      <Grid>
        <Row>
          <h2>
            Sign up
          </h2>
          <hr/>
          <Col md={12}>


            <form onSubmit={hello}>
              <Input
                placeholder="User Name"
                onChange={this.handleInputUserName}
                label="User Name"
                type ="text"/>
              <br/>
              <Input
                placeholder="Enter Password"
                onChange={this.handleInputPassword}
                label="Password"
                type="password" />
              <br/>
              <Input
                placeholder="Pirate Level"
                onChange={this.handleInputPirateLevel}
                label="Pirate Level"
                type ="number"
                min = "1"
                max = "10000" />
              <br/>
              <Button bsStyle="primary">
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
