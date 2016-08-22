import React from 'react';
import { Grid, Jumbotron, PageHeader } from 'react-bootstrap';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.adStyle = { display: 'inline-block', width: '336px', height: '280px', 'lineHeight': '280px' };
  }

  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    return (
      <Grid id="content">
        <PageHeader>Ohara <small>One Piece Treasure Cruise's Library</small></PageHeader>
        <ins className="adsbygoogle"
          style={this.adStyle}
          data-ad-client="ca-pub-3382549750623853"
          data-ad-slot="1624873575"
        >Please help support Ohara by disabling adblock.</ins>
      </Grid>);
  }
}

export default Home;
