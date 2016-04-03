import React from 'react';
import {Grid, Row, Col, Button, Input, Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

function Header(props, context) {
  var links = [];
  links.push(<NavItem href='/signup'>Sign Up</NavItem>);
  var login_form = 
    <Navbar.Form pullRight id="login-bar">
      <form action="/login" method="POST">
        <Input
          placeholder="User Name"
          bsSize="small"
          name="username"
          type="text"/>
        <Input
          placeholder="Password"
          bsSize="small"
          name="password"
          type="password" />
        <Button bsStyle="primary" bsSize="small" type="submit">Login</Button>
      </form>
    </Navbar.Form>;
  if (typeof props.user != 'undefined') {
    links = [];
    links.push(<NavItem href='/account'>Accounts</NavItem>);
    links.push(<NavItem href='/logout'>Logout</NavItem>);
    login_form = '';
  }
  return (
  <Grid>
    <Row>
      <Navbar id="nav-bar">
        <div className="nav navbar-nav" id="navbar-image"></div>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/" id="brand">Ohara</a> 
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem href="/friend_finder">Friend Finder</NavItem>
          {links}
        </Nav>
        {login_form}
      </Navbar>
    </Row>
  </Grid>
  );
}

export default Header;
