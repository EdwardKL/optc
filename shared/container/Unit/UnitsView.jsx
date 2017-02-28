import React, { PropTypes } from 'react';
import * as Actions from '../../redux/actions/actions';
import { Grid, Pagination, Row, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { connect } from 'react-redux';
import Unit from '../../components/Unit/Unit';

export class UnitsView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.units = props.units;
    this.state.activePage = 1;
    this.state.num_pages = props.num_pages;
    this.dispatch = props.dispatch;

    this.handlePagination = (eventKey) => {
      this.dispatch(Actions.fetchUnits(eventKey));
      this.setState({
        activePage: eventKey,
        update: false,
      });
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      units: nextProps.units,
      update: true,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.update;
  }

  render() {
    return (
      <Grid id="content">
        <Row>
          <h2>Units</h2>
          <hr />
        </Row>
        <Row>
          {this.state.units.map((unit) => {
            return (<Unit id={unit.id} name={unit.name} key={unit.id} />);
          })}
        </Row>
        <Row className="unitPagination">
          <Pagination
            bsSize="medium"
            ellipsis
            prev
            next
            first
            last
            boundaryLinks
            maxButtons={7}
            items={this.state.num_pages}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
          />
        </Row>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    units: store.unit.units,
    num_pages: store.unit.num_pages,
  };
}

// For some reason if you don't supply params here this gets called and responds before mongoose has a chance to do anything...
// ... ?!
UnitsView.need = [(params) => {
  return Actions.fetchUnits(1);
}, (params) => {
  return Actions.fetchNumUnitPages();
}];

UnitsView.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  num_pages: PropTypes.number.isRequired,
  // This comes by default with connect below.
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(UnitsView);
