import React, {Component, PropTypes} from 'react';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import {Grid, Row, Col, Panel, Pagination,Button, Well, Label, Input, ButtonInput, MenuItem} from 'react-bootstrap';

class FriendFinder extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.query = '';
    this.state.friend_search_results = [];
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(e) {
    this.setState({ query: e.target.value });
  }

  // getQueryUrl() {
  //   return '/friend_finder/' + this.state.query;
  // }

  handleSearch() {
    this.props.dispatch({ type: 'FIND_FRIENDS', query: this.state.query });
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
            <Button bsStyle="primary" type="submit" onClick={this.handleSearch}>
              Search
            </Button>
          </Col>
        </Row>
        <Row>
          {this.state.query ? console.log('search results:', this.state.friend_search_results) : console.log("nothing here")}
        </Row>
      </Grid>
    )
  }
}

// FriendFinder.need = [(params) => {
//   return Actions.getFriendsRequest.bind(null, params.captain_id)();
// }];

FriendFinder.propTypes = {
  friend_search_results: PropTypes.arrayOf(PropTypes.shape({
    current_level: PropTypes.number.isRequired,
    current_special_level: PropTypes.number.isRequired,
  })).isRequired,
  dispatch: PropTypes.func.isRequired
};


function mapStateToProps(store) {
  return {
    friend_search_results: (store.friend_search_results)
  };
}

export default connect(mapStateToProps)(FriendFinder);
