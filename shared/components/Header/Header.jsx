import React from 'react';
import {Grid, Row, Col, Button, Input} from 'react-bootstrap';

var linkStyle = {
    color: 'white'
};

function Header(props, context) {
  var links = 
    <div>
        <a href='/signup' style={linkStyle}>Sign Up or Login With...</a> <br />
    </div>;
  var login_form = 
        <Row>
            <form action="/login" method="POST">
                <Col md={3} mdOffset={5}>
                  <Input
                    placeholder="User Name"
                    bsSize="small"
                    name="username"
                    type="text"/>
                </Col>
                <Col md={3}>
                  <Input
                    placeholder="Password"
                    bsSize="small"
                    name="password"
                    type="password" />
                </Col>
                <Col md={1}>
                  <Button bsStyle="primary" bsSize="small" type="submit">
                    Login
                  </Button>
                </Col>
            </form>
        </Row>;
  if (typeof props.user != 'undefined') {
    links = <div><span style={linkStyle}>Welcome, {props.user.username}!</span> <a href='/account' style={linkStyle}>My Account</a>  |  <a href='/logout' style={linkStyle}>Log out</a><br/></div>;
    login_form = '';
  }
  return (
    <div className="header">
      <div className="header-content">
        <Grid>
        <Row>
        <Col md={5}>
        <h2 className="site-title">
          <a href="/">OPTC Ohara</a>
        </h2>
        </Col>
        <Col md={6}>
            <a href='/friend_finder' style={linkStyle}>Friend Finder</a>
            {links}
        </Col>
        </Row>
        {login_form}
        </Grid>
      </div>
    </div>
  );
}

export default Header;
