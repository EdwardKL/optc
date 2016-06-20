import React, { Component, PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Account from '../../components/Account/Account';
import { Grid, Row, Col, Button, Well, Label, Input } from 'react-bootstrap';

export class FriendFinderView extends Component {
  constructor(props, context) {
    console.log('calling friend finder constructor');
    super(props, context);
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
    return (
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
          {this.state.friend_search_results.map( (result) => {
            if (result.user) {
              {return result.user._accounts.map((account) => {
                for (var i = 0; i < account._captains.length; i++) {
                  if (account._captains[i]._unit == this.state.query) {
                    return <Account edit={false} account_data={account} key={account._id}/>;
                  }
                }
              })}
            }
          })}
        </Row>
      </Grid>
    );
  }

}

FriendFinderView.need = [(params) => {
  if (params.captain_id) {
    console.log('params.captain_id not empty!');
    return Actions.fetchQuery(params.captain_id);
  } else {
    console.log('params.captain_id is empty!');
    return Actions.fetchQuery('-1');
  }
}];

FriendFinderView.propTypes = {
  friend_search_results: PropTypes.arrayOf(PropTypes.shape({
    current_level: PropTypes.number.isRequired,
    current_special_level: PropTypes.number.isRequired,
    user: PropTypes.shape({
      accounts: PropTypes.arrayOf(PropTypes.object),
      display_name: PropTypes.string
    })
  })),
  dispatch: PropTypes.func
};


function mapStateToProps(store) {
  return {
    friend_search_results: store.friendFinder.friend_search_results
  };
}

export default connect(mapStateToProps)(FriendFinderView);
