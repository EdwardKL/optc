import React, { PropTypes } from 'react';
import { Link } from 'react-router';

var linkStyle = {
    color: 'white'
};

function Header(props, context) {
  return (
    <div className="header">
      <div className="header-content">
        <h2 className="site-title">
          <Link to="/">OPTC Ohara</Link>
        </h2>
        <Link to="/friend_finder" style={linkStyle}> Friend Finder</Link>
        <br/>
        <Link to="/signup" style={linkStyle}> Sign In</Link>
      </div>
    </div>
  );
}

Header.contextTypes = {
  router: React.PropTypes.object,
};
/*
Header.propTypes = {
  onClick: PropTypes.func.isRequired,
  handleLogoClick: PropTypes.func,
};*/

export default Header;
