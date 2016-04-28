import React, {Component, PropTypes} from 'react';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import {Grid, Row, Col, Button, Well, Label, Input} from 'react-bootstrap';

import FriendFinderResult from '../../components/FriendFinderResult/FriendFinderResult';

class FriendFinder extends Component {
  constructor(props, context){
    console.log("calling friend finder constructor");
    super(props, context);
    console.log('props: ', props);
    this.state = {};
    this.state.query = props.params.captain_id ? props.params.captain_id : '';
    this.state.friend_search_results = props.friend_search_results;
    this.state.socket_selections = props.socket_selections;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ query: e.target.value });
  }

  render() {
    return(
      <Grid id="content">
        <Row>
          <h2>
            Find Friends
          </h2>
          <hr/>
          <Col md={12}>
            <Input
              placeholder="Captain ID"
              label="Captain ID"
              name="captain_id"
              type="text"
              onChange={this.handleChange}/>
            <br/>
            <Button bsStyle="primary" type="submit" href={`/friend_finder/${this.state.query}`}>
            Search
            </Button>
          </Col>
        </Row>
        <Row>
          {console.log('search results:', this.state)}
          {this.state.friend_search_results.map(function(result) {
            return <FriendFinderResult data={result}/>
          })}
        </Row>
      </Grid>
    )
  }

}

FriendFinder.need = [(params) => {
  if (params.captain_id) {
    console.log("params.captain_id not empty!");
    return Actions.fetchQuery(params.captain_id);
  } else {
    console.log("params.captain_id is empty!");
    return Actions.fetchQuery("-1");
  }
}];

FriendFinder.propTypes = {
  friend_search_results: PropTypes.arrayOf(PropTypes.shape({
    current_level: PropTypes.number.isRequired,
    current_special_level: PropTypes.number.isRequired,
    user: PropTypes.shape({
      accounts: PropTypes.arrayOf(PropTypes.object),
      display_name: PropTypes.string
    })
  })),
  dispatch: PropTypes.func.isRequired
};


function mapStateToProps(store) {
  return {
    friend_search_results: store.friend_search_results ? store.friend_search_results : []
  };
}

export default connect(mapStateToProps)(FriendFinder);
