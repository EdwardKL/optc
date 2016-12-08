import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import { Header } from '../../../components/Header/Header';
import React from 'react';
import expectJSX from 'expect-jsx';
import { Link } from 'react-router';
import { Alert, Grid, Row, Col, Button, Input, Nav, Navbar, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

expect.extend(expectJSX);

const adStyle = { display: 'inline-block', width: '730px', height: '92px', lineHeight: '92px' };
describe('header component signed out test', () => {
  var getExpectedJSX = function (alerts) {
    // Just FYI, if you put <Grid> on the next line, this will crash. = =
    return (<Grid>
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
                    <NavItem href="/friend_finder" key="0">Friend Finder</NavItem>
                    <NavItem href="/units" key="5">Units</NavItem>
                    <NavItem href="/signup" key="1">Sign Up</NavItem>
                    <NavItem href="https://github.com/EdwardKL/optc/issues" key="6">Report Bugs</NavItem>
                  </Nav>
                  <Navbar.Form pullRight id="login-bar">
                    <form action="/login" method="POST">
                      <Input
                        placeholder="User Name"
                        bsSize="small"
                        name="username"
                        type="text"
                      />
                      <Input
                        placeholder="Password"
                        bsSize="small"
                        name="password"
                        type="password"
                      />
                      <Button bsStyle="primary" bsSize="small" type="submit">Login</Button>
                    </form>
                  </Navbar.Form>
                </Navbar.Collapse>
              </Navbar>
            </Row>
            {alerts}
            <Row><div id="grejvg34598fj34789fju">Please consider supporting Ohara by disabling adblock.</div></Row>
            <Row id="gjeofh28348f32">
              <ins className="adsbygoogle"
                style={adStyle}
                data-ad-client="ca-pub-3382549750623853"
                data-ad-slot="6299615170"
              ></ins>
            </Row>
          </Grid>);
  };

  it('should render the header when signed out properly', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Header />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(<Row><div /><div /></Row>));
  });

  it('should render info messages when given', () => {
    const info_message = 'This is an info message';
    const renderer = TestUtils.createRenderer();
    // Send data as a prop to simulate the redux store being set and sent properly.
    renderer.render(<Header info_message={info_message} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(
      <Row>
        <Alert bsStyle="info" id="info-alert">{info_message}</Alert>
        <div />
      </Row>));
  });

  it('should render error messages when given', () => {
    const error_message = 'This is an error message';
    const renderer = TestUtils.createRenderer();
    // Send data as a prop to simulate the redux store being set and sent properly.
    renderer.render(<Header error_message={error_message} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(
      <Row>
          <div />
          <Alert bsStyle="danger" id="error-alert">{error_message}</Alert>
      </Row>));
  });

  it('should render both info and error messages when given', () => {
    const info_message = 'This is an info message';
    const error_message = 'This is an error message';
    const renderer = TestUtils.createRenderer();
    // Send data as a prop to simulate the redux store being set and sent properly.
    renderer.render(<Header info_message={info_message} error_message={error_message} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(getExpectedJSX(
      <Row>
          <Alert bsStyle="info" id="info-alert">{info_message}</Alert>
          <Alert bsStyle="danger" id="error-alert">{error_message}</Alert>
      </Row>));
  });
});


describe('header component signed in test', () => {
  var user = { display_name: 'Test_Display_Name' };

  it('should render the header when signed in properly', () => {
    const renderer = TestUtils.createRenderer();
    // Send the user as a prop to simulate the redux store being set and sent properly.
    renderer.render(<Header user={user} />);
    const output = renderer.getRenderOutput();
    expect(output).toEqualJSX(
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
                <NavItem href="/friend_finder" key="0">Friend Finder</NavItem>
                <NavItem href="/units" key="5">Units</NavItem>
                <NavItem href="/account" key="2">Accounts</NavItem>
                <NavItem href="https://github.com/EdwardKL/optc/issues" key="6">Report Bugs</NavItem>
                <NavItem href="/logout" key="3">Logout</NavItem>
              </Nav>
              <Nav pullRight>
                <NavItem href="/account" key="4">{user.display_name}</NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Row>
        <Row>
          <div />
          <div />
        </Row>
        <Row><div id="grejvg34598fj34789fju">Please consider supporting Ohara by disabling adblock.</div></Row>
        <Row id="gjeofh28348f32">
          <ins className="adsbygoogle"
            style={adStyle}
            data-ad-client="ca-pub-3382549750623853"
            data-ad-slot="6299615170"
          ></ins>
        </Row>
      </Grid>
    );
  });
});
