import React, { Component, PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Account from '../../components/Account/Account';
import UnitSelector from '../../components/Captain/UnitSelector';
import { Grid, Row, Col, Button, Well, Label, Input } from 'react-bootstrap';

export class FriendFinderView extends Component {
  constructor(props, context) {
    console.log('calling friend finder constructor');
    super(props, context);
    this.state = {};
    this.state.friend_search_results = props.friend_search_results;
    this.state.unit_selections = props.unit_selections;
    this.state.unit = props.params.captain_id ? this.state.unit_selections[props.params.captain_id - 1] : this.state.unit_selections[0];
    this.unitSelected = this.unitSelected.bind(this);
  }

  unitSelected(e) {
    const unit = this.state.unit_selections[e.target.value - 1];
    this.setState({ unit });
  }

  render() {

    let accountSet = new Set();

    return (
      <Grid id="content">
        <Row>
          <h2>
            Find Friends
          </h2>
          <hr/>
          <Col md={12}>
            <p>To look for friends who have a particular unit,
              please select the unit in the drop down below.</p>
          </Col>
          <Col md={12}>
            <UnitSelector
              unit_selections={this.state.unit_selections}
              default_unit_id={this.state.unit._id}
              onChange={this.unitSelected}/>
          </Col>
          <Col md={12}>
            <Button bsStyle="primary" type="submit" href={`/friend_finder/${this.state.unit._id}`}>
            Search
            </Button>
          </Col>
        </Row>
        <Row>
          {console.log('search results:', this.state.friend_search_results)}
          {this.state.friend_search_results.map( (result) => {
            if (result.user) {
              {return result.user._accounts.map((account) => {
                // prevent displaying the same account multiple times (when the accounts have same captains)
                if (!accountSet.has(account._id)) {
                  accountSet.add(account._id);
                  for (var i = 0; i < account._captains.length; i++) {
                    if (account._captains[i]._unit == this.state.unit._id) {
                      return <Account edit={false} account_data={account} key={account._id}/>;
                    }
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
  dispatch: PropTypes.func,
  unit_selections: PropTypes.arrayOf(PropTypes.object)
};


function mapStateToProps(store) {
  return {
    friend_search_results: store.friendFinder.friend_search_results,
    unit_selections: store.identity.unit_selections
  };
}

export default connect(mapStateToProps)(FriendFinderView);
