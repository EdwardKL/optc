import React from 'react';
import { Grid, Jumbotron, PageHeader } from 'react-bootstrap';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.adStyle = { display: 'inline-block', width: '336px', height: '280px' };
  }

  render() {
    return (
      <Grid id="content">
        <PageHeader>Ohara <small>One Piece Treasure Cruise's Library</small></PageHeader>
        <Jumbotron id="newsbox">
          <h3>News</h3>
          <p>Alpha launch by EOQ.</p>
          <p>Alpha friend finder online.</p>
        </Jumbotron>
        <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        <ins className="adsbygoogle"
          style={this.adStyle}
          data-ad-client="ca-pub-3382549750623853"
          data-ad-slot="1624873575"
        ></ins>
        <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </Grid>);
  }
}

export default Home;
