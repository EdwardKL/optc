import React from 'react';

var linkStyle = {
    color: 'white'
};

function Header(props, context) {
  var links = <div><a href='/signup' style={linkStyle}>Sign Up</a><br/><a href='/login' style={linkStyle}>Login</a></div>;
  if (typeof props.user != 'undefined') {
    links = <div><span style={linkStyle}>Welcome, {props.user.username}!</span> <a href='/account' style={linkStyle}>My Account</a>  |  <a href='/logout' style={linkStyle}>Log out</a><br/></div>;
  }
  return (
    <div className="header">
      <div className="header-content">
        <h2 className="site-title">
          <a href="/">OPTC Ohara</a>
        </h2>
        <a href='/friend_finder' style={linkStyle}>Friend Finder</a>
        <br/>
        {links}
      </div>
    </div>
  );
}

export default Header;
