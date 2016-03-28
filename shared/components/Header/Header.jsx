import React from 'react';
import { Link } from 'react-router';

var linkStyle = {
    color: 'white'
};

function Header(props, context) {
  return (
    <div className="header">
      <div className="header-content">
        <h2 className="site-title">
          <a href="/">OPTC Ohara</a>
        </h2>
        <a href="/friend_finder" style={linkStyle}> Friend Finder</a>
        <br/>
        <a href="/signup" style={linkStyle}> Sign In</a>
        <br/>
        <a href="/account" style={linkStyle}>My Account</a>
      </div>
    </div>
  );
}

export default Header;
