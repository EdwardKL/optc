import React from 'react';
import { Link } from 'react-router';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

class FriendFinder extends React.Component {
  constructor(props, context){
    super(props, context);
  }

  render() {
    return(
      <Grid>
        <Row>
          <h2>
            Find Friends
          </h2>
          <hr/>
          <Col md={12}>


            <form action="/friend_finder" method="POST">
              <Input
                placeholder="Captain ID"
                label="Captain ID"
				name="captain_id"
                type="text"/>
              <br/>
              <Button bsStyle="primary" type="submit">
                Search
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default FriendFinder;
