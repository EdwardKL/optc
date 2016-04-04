import React from 'react';
import {Grid, Row, Col, Button, Input, Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

class Header extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state = {}
    this.state.user = props.user;
  }
  
  toggle() {
    console.log("Toggle clicked.");
  }
  
  render() {
    var links = [];
    links.push(<NavItem href='/signup' key='1'>Sign Up</NavItem>);
    var right_element = 
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
    if (typeof this.state.user != 'undefined') {
      links = [];
      links.push(<NavItem href='/account' key='2'>Accounts</NavItem>);
      links.push(<NavItem href='/logout' key='3'>Logout</NavItem>);
      right_element = <Nav pullRight><NavItem href='/account' key='4'>{this.state.user.display_name}</NavItem></Nav>;
    }
    return (
      <Grid>
        <Row>
          <Navbar onToggle={this.state.toggle} id="header-bar">
            <div className="nav navbar-nav" id="navbar-image"></div>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/" id="brand">Ohara</a> 
              </Navbar.Brand>
              <Navbar.Toggle onClick={this.state.toggle}/>
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavItem href="/friend_finder" key='0'>Friend Finder</NavItem>
                {links}
              </Nav>
              {right_element}
            </Navbar.Collapse>
          </Navbar>
        </Row>
      </Grid>
    );
  }
}

export default Header;
