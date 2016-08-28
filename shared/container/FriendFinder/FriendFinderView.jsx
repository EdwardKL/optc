import React, { Component, PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Account from '../../components/Account/Account';
import UnitSelector from '../../components/Captain/UnitSelector';
import { FRIEND_FINDER_RESULTS_PAGE_SIZE } from '../../../constants/common';
import { Grid, Row, Col, Button, FormGroup, Radio, Pagination } from 'react-bootstrap';

export class FriendFinderView extends Component {
  constructor(props, context) {
    console.log('calling friend finder constructor');
    super(props, context);
    this.state = {};
    this.state.friend_search_results = props.friend_search_results;
    this.state.unit_selections = props.unit_selections;
    this.state.unit = props.params.captain_id ? this.state.unit_selections[props.params.captain_id - 1] : this.state.unit_selections[0];
    this.state.selected_region = 'global';
    this.dispatch = props.dispatch;
    this.state.activePage = 1;
    this.state.num_pages = props.num_pages;
    this.unitSelected = this.unitSelected.bind(this);
    this.handleRegionOptionChange = this.handleRegionOptionChange.bind(this);

    this.handleFriendSearch = () => {
      this.dispatch(Actions.fetchFriendFinderResults(this.state.unit._id, this.state.selected_region, 1));
      this.dispatch(Actions.fetchNumFriendFinderResultPages(this.state.unit._id, this.state.selected_region));
    };

    this.handlePagination = (eventKey) => {
      this.dispatch(Actions.fetchFriendFinderResults(this.state.unit._id, this.state.selected_region, eventKey));
      this.setState({
        activePage: eventKey,
      });
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('component receiving nextprops.friendsearchresults:', nextProps.friend_search_results);
    this.setState({
      friend_search_results: nextProps.friend_search_results,
      num_pages: nextProps.num_pages,
      update: true,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.update;
  }

  unitSelected(e) {
    this.setState({
      unit: this.state.unit_selections[e.target.value - 1],
      update: false
    });
  }

  handleRegionOptionChange(e) {
    this.setState({
      selected_region: e.target.value,
      update: false
    });
  }

  render() {
    console.log('rendering friend finder view');
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
            <FormGroup>
              <Radio inline
                     onChange={this.handleRegionOptionChange}
                     value="global"
                     checked={this.state.selected_region === 'global'}>
                Global
              </Radio>
              <Radio inline
                     onChange={this.handleRegionOptionChange}
                     value="japan"
                     checked={this.state.selected_region === 'japan'}>
                Japan
              </Radio>
            </FormGroup>
            </Col>

            <Col md={12}>
            <Button bsStyle="primary"
                    type="submit"
                    onClick={this.handleFriendSearch}>
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
        <Row className="unitPagination">
          {console.log('account set:', accountSet)}
          {console.log('num items:', this.state.num_pages)}
          {console.log('active page:', this.state.activePage)}
          <Pagination
            className={accountSet.size === 0? 'hidden':'shown'}
            prev
            next
            first
            last
            boundaryLinks
            maxButtons={5}
            bsSize="medium"
            ellipsis={false}
            items={this.state.num_pages}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
          />
        </Row>
      </Grid>
    );
  }

}

FriendFinderView.need = [(params) => {
  if (params.captain_id) {
    console.log('params.captain_id not empty!');
    return Actions.fetchFriendFinderResults(params.captain_id, 'global', 1);
  } else {
    console.log('params.captain_id is empty!');
    return Actions.fetchFriendFinderResults('-1', 'global', 1);
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
  unit_selections: PropTypes.arrayOf(PropTypes.object),
  num_pages: PropTypes.number
};


function mapStateToProps(store) {
  return {
    friend_search_results: store.friendFinder.friend_search_results,
    unit_selections: store.identity.unit_selections,
    num_pages: store.friendFinder.num_pages
  };
}

export default connect(mapStateToProps)(FriendFinderView);
