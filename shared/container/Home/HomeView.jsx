import React from 'react';
import { Grid, PageHeader, Row, Col } from 'react-bootstrap';

class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    return (
      <Grid id="content">
        <PageHeader>Ohara <small>One Piece Treasure Cruise&rsquo;s Library</small></PageHeader>
        <div id="homeContent">
          <Row>
            <a href="/signup">
              <div className="homeEntry">
                <span className="entryHeader">Sign Up</span>
                <br />
                <span className="entryBlurb">Add your OPTC account so others can find you, and post on our site!</span>
              </div>
            </a>
            <br />
            <a href="/friend_finder">
              <div className="homeEntry homeFF">
                <span className="entryHeader">Friend Finder</span>
                <br />
                <span className="entryBlurb">Find players with the captains you need!</span>
              </div>
            </a>
            <br />
            <a href="/units">
              <div className="homeEntry homeUnits">
                <span className="entryHeader">Units</span>
                <br />
                <span className="entryBlurb">Lookup unit data, posts and recommendations!</span>
              </div>
            </a>
          </Row>
          <hr />
          <div id="news">
            <h3>News</h3>
            2017/02/20 - Open for Beta! There might be a few bugs left, but for the most part things should be stable.
            2016/09/01 - Open for Alpha!
          </div>
        </div>
      </Grid>);
  }
}

export default Home;
