import React, { PropTypes } from 'react';
import { Alert, Grid, Row, Nav, Navbar, NavItem, Input, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

export class Footer extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.adStyle = { display: 'inline-block', width: '728px', height: '90px' };
  }

  render() {
    return (
      <Grid className="ad">
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins className="adsbygoogle"
          style={this.adStyle}
          data-ad-client="ca-pub-3382549750623853"
          data-ad-slot="9148140371"
        ></ins>
        <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </Grid>
    );
  }
}

export default Footer;
