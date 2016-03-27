import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function Header(props, context) {
  return (
    <div className="header">
	  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
      <div className="header-content">
        <h2 className="site-title">
          <Link to="/" onClick={props.handleLogoClick}>Welcome to the Grand Line!</Link>
        </h2>
        <Link to="/friend_finder"> Friend Finder</Link>
        <br/>
        <Link to="/signup"> Sign In</Link>
      </div>
    </div>
  );
}

Header.contextTypes = {
  router: React.PropTypes.object,
};

Header.propTypes = {
  onClick: PropTypes.func.isRequired,
  handleLogoClick: PropTypes.func,
};

export default Header;
