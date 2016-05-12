import React from 'react';
import { Grid, Jumbotron, PageHeader } from 'react-bootstrap';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
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
      </Grid>);
  }
}

export default Home;
