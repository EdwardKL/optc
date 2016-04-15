import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import { Header } from '../components/Header/Header';
import React from 'react';
import expectJSX from 'expect-jsx';
import { Link } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '../redux/store/configureStore';
import {Alert, Grid, Row, Col, Button, Input, Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

expect.extend(expectJSX);

describe('header component test', () => {
  beforeEach('setup dom', function (done) {
    this.jsdom = require('jsdom-global')();
    done();
  });

  afterEach(function (done) {
    this.jsdom();
    done();
  });

  it('should render the header when signed out properly', () => {
    const store = configureStore({});
    const renderer = TestUtils.createRenderer();
    renderer.render(<Header />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(
      <Grid>
        <Row>
          <Navbar id="header-bar">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/"><div className="nav navbar-nav" id="navbar-image"></div><span id="brand">Ohara</span></a> 
              </Navbar.Brand>
              <Navbar.Toggle/>
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <NavItem href="/friend_finder" key='0'>Friend Finder</NavItem>
                <NavItem href='/signup' key='1'>Sign Up</NavItem>
              </Nav>
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
              </Navbar.Form>
            </Navbar.Collapse>
          </Navbar>
        </Row>
        <Row>
          <div />
          <div />
        </Row>
      </Grid>
    );
  });
});