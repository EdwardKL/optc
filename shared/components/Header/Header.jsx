import React, { PropTypes } from 'react';
import { Alert, Grid, Row, Nav, Navbar, NavItem, Input, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

export class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.user = props.user;
    this.state.info_message = props.info_message ? props.info_message : '';
    this.state.error_message = props.error_message ? props.error_message : '';
  }

  render() {
    var links = [];
    links.push(<NavItem href='/signup' key='1'>Sign Up</NavItem>);
    var right_element =
      (<Navbar.Form pullRight id="login-bar">
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
      </Navbar.Form>);
    if (typeof this.state.user !== 'undefined') {
      links = [];
      links.push(<NavItem href='/account' key='2'>Accounts</NavItem>);
      links.push(<NavItem href='/logout' key='3'>Logout</NavItem>);
      right_element = <Nav pullRight><NavItem href='/account' key='4'>{this.state.user.display_name}</NavItem></Nav>;
    }
    return (
      <Grid>
        <Row>
          <Navbar id="header-bar">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/"><div className="nav navbar-nav" id="navbar-image"></div><span id="brand">Ohara</span></a>
              </Navbar.Brand>
              <Navbar.Toggle />
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
        <Row>
          {this.state.info_message.length > 0 ? <Alert bsStyle="info" id="info-alert">{this.state.info_message}</Alert> : <div />}
          {this.state.error_message.length > 0 ? <Alert bsStyle="danger" id="error-alert">{this.state.error_message}</Alert> : <div />}
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    user: store.identity.user,
    info_message: store.identity.info_message,
    error_message: store.identity.error_message,
  };
}

Header.propTypes = {
  user: PropTypes.object,
  info_message: PropTypes.string,
  error_message: PropTypes.string,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Header);
